from django.db import transaction
from knox.models import AuthToken
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import UpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .gameplay import grade_answers_and_get_next_adventure, get_summary
from .graph_utils.chaptertograph import chapter_to_graph
from .graph_utils.initialadventurefinder import designate_initial_adventure
from .graph_utils.verifier import verify_adventure_graph
from .models import NextAdventureChoice
from .permissions import IsTutor, IsStudent
from .serializers import *


class CourseView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, course_id=None, format=None):
        if not course_id:
            serializer = CourseSerializer(Course.objects.all(), many=True)
        else:
            serializer = CourseSerializer(Course.objects.get(pk=course_id))
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CreateCourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = Course.objects.create(**serializer.validated_data)
        return Response(CourseSerializer(course).data)

    def delete(self, request, course_id=None):
        if not course_id:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        else:
            Course.objects.get(pk=course_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterStudentView(APIView):
    def post(self, request):
        return save_participant(request, group_name='student')


class RegisterTutorView(APIView):
    def post(self, request):
        return save_participant(request, group_name='tutor')


def save_participant(request, group_name):
    participant_serializer = ParticipantSerializer(data=request.data)
    participant_serializer.is_valid(raise_exception=True)
    participant = participant_serializer.save()
    user_token = participant.register(group_name=group_name)
    return Response({
        "user": participant_serializer.data,
        "token": user_token
    })


class LoginView(APIView):
    def post(self, request):
        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)
        user = login_serializer.validated_data
        _, user_token = AuthToken.objects.create(user)
        return Response({
            "user": ParticipantSerializer(user).data,
            "token": user_token
        })


class CourseGroupView(APIView):
    permission_classes = [IsTutor]

    def post(self, request, course_id):
        course = Course.objects.get(pk=course_id)
        created_groups = course.add_course_groups(request.data)
        return Response(CourseGroupSerializer(created_groups, many=True).data)


class PlotPartView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, course_id):
        serializer = PlotPartSerializer(PlotPart.objects.filter(course_id=course_id), many=True)
        return Response(serializer.data)

    def post(self, request, course_id):
        serializer = CreatePlotPartSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        course = Course.objects.get(pk=course_id)
        new_plot_parts = [PlotPart.objects.create(course=course, **serialized_plot_part)
                          for serialized_plot_part in serializer.validated_data]
        return Response(PlotPartSerializer(new_plot_parts, many=True).data)


class SpecificPlotPartView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, plot_part_id):
        serializer = PlotPartSerializer(PlotPart.objects.get(pk=plot_part_id))
        return Response(serializer.data)


class ChapterView(APIView):
    permission_classes = [IsTutor]

    def post(self, request, plot_part_id):
        serializer = CreateChapterSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        plot_part = PlotPart.objects.get(pk=plot_part_id)
        created_chapters = [Chapter.objects.create(plot_part=plot_part, **chapter_dict) for chapter_dict in serializer.validated_data]
        return Response(ChapterSerializer(created_chapters, many=True).data)

    def get(self, request, plot_part_id):
        serializer = ChapterSerializer(Chapter.objects.filter(plot_part_id=plot_part_id), many=True)
        return Response(serializer.data)


class SpecificChapterView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, chapter_id):
        serializer = ChapterSerializer(Chapter.objects.get(pk=chapter_id))
        return Response(serializer.data)


class AdventureView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, chapter_id):
        chapter = Chapter.objects.get(pk=chapter_id)
        adventures = Adventure.objects.filter(chapter=chapter)
        adventure_serializer = AdventureSerializer(adventures, many=True)
        paths = chapter.paths
        path_serializer = PathSerializer(paths, many=True)
        choices = chapter.choices
        choices_serializer = NextAdventureChoiceSerializer(choices, many=True)

        return Response({
            'adventures': adventure_serializer.data,
            'paths': path_serializer.data,
            'choices': choices_serializer.data
        })

    def post(self, request, chapter_id):
        serializer = CreateAdventuresSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        chapter = Chapter.objects.get(pk=chapter_id)
        new_adventure = serializer.save(chapter=chapter)
        return Response(AdventureSerializer(new_adventure).data)


class UpdateAdventureView(RetrieveUpdateDestroyAPIView):
    queryset = Adventure.objects.all()
    serializer_class = CreateAdventuresSerializer
    permission_classes = [IsTutor]


def save_chapter_structure(request, chapter_id, update=False, draft=False):
    chapter = Chapter.objects.get(pk=chapter_id)
    if update:
        Path.objects.filter(from_adventure__chapter=chapter).delete()
        NextAdventureChoiceDescription.objects.filter(from_adventure__chapter=chapter).delete()
    _create_paths(request.data['paths'])
    _create_descriptions(request.data.get('descriptions', []))
    if not draft:
        adventure_graph = chapter_to_graph(chapter)
        initial_adventure = designate_initial_adventure(adventure_graph)
        verify_adventure_graph(adventure_graph, initial_adventure)
        chapter.complete()
    else:
        chapter.uncomplete()
    return Response(ChapterSerializer(chapter).data)


def _create_paths(paths_data):
    serializer = PathSerializer(data=paths_data, many=True)
    serializer.is_valid(raise_exception=True)
    return serializer.save()


def _create_descriptions(descriptions_data):
    serializer = NextAdventureChoiceSerializer(data=descriptions_data, many=True)
    serializer.is_valid(raise_exception=True)
    return serializer.save()


class ChapterSubmissionView(APIView):
    permission_classes = [IsTutor]

    @transaction.atomic
    def post(self, request, chapter_id):
        return save_chapter_structure(request, chapter_id)

    @transaction.atomic
    def put(self, request, chapter_id):
        return save_chapter_structure(request, chapter_id, update=True)


class ChapterDraftSubmissionView(APIView):
    permission_classes = [IsTutor]

    @transaction.atomic
    def post(self, request, chapter_id):
        return save_chapter_structure(request, chapter_id, draft=True)

    @transaction.atomic
    def put(self, request, chapter_id):
        return save_chapter_structure(request, chapter_id, update=True, draft=True)


class ChapterStartView(APIView):
    permission_classes = [IsStudent]

    def get(self, request, chapter_id):
        chapter = Chapter.objects.get(pk=chapter_id)
        return Response({
            'response_type': 'adventure',
            'chapter_name': chapter.name,
            'adventure': AdventureSerializer(chapter.initial_adventure).data
        })


class AdventureAnswerView(APIView):
    permission_classes = [IsStudent]

    def post(self, request, adventure_id):
        serializer = AdventureAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        current_adventure = Adventure.objects.get(pk=adventure_id)
        closed_questions_data = data['closed_questions']
        open_questions_data = data['open_questions']
        closed_questions = []
        for question_data in closed_questions_data:
            closed_questions.append((Question.objects.get(pk=question_data['question_id']),
                                    set([Answer.objects.get(pk=answer_id)
                                         for answer_id in question_data['marked_answers']])))
        open_questions = []
        for question_data in open_questions_data:
            open_questions.append((Question.objects.get(pk=question_data['question_id']),
                                   question_data['given_answer']))
        next_adventures = grade_answers_and_get_next_adventure(self.request.user,
                                                               current_adventure,
                                                               data['start_time'], data['answer_time'],
                                                               closed_questions,
                                                               open_questions)
        if len(next_adventures) == 0:
            return Response({
                'response_type': 'summary',
                'summary': AdventureSummarySerializer(get_summary(self.request.user, current_adventure), many=True).data
            })
        elif len(next_adventures) == 1:
            return Response({
                'response_type': 'adventure',
                'adventure': AdventureSerializer(next_adventures[0]).data
            })
        else:
            return Response({
                'response_type': 'choice',
                'choice': NextAdventureChoiceSerializer(NextAdventureChoice.for_adventure(current_adventure)).data
            })


class NextAdventureChoiceView(APIView):
    permission_classes = [IsStudent]

    def get(self, request, to_adventure_id):
        return Response({
            'response_type': 'adventure',
            'adventure': AdventureSerializer(Adventure.objects.get(pk=to_adventure_id)).data
        })


class WhoAmIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipantSerializer

    def get_object(self):
        return self.request.user
