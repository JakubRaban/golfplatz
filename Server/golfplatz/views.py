from knox.models import AuthToken
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import PathChoiceDescription, NextAdventureChoiceDescription, NextAdventureChoice
from .permissions import IsTutor, IsStudent
from .serializers import *
from .gameplay import grade_answers_and_get_next_adventure, get_summary


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
        new_plot_parts = [course.add_plot_part(**serialized_plot_part)
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
        created_chapters = [plot_part.add_chapter(**chapter_dict) for chapter_dict in serializer.validated_data]
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
        path_serializer = PathSerializer(chapter.get_paths(), many=True)
        return Response({
            'adventures': adventure_serializer.data,
            'paths': path_serializer.data
        })

    def post(self, request, chapter_id):
        serializer = CreateAdventuresSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        chapter = Chapter.objects.get(pk=chapter_id)
        new_adventures = chapter.add_adventures(serializer.validated_data)
        return Response({
            'adventures': AdventureSerializer(new_adventures, many=True).data,
            'paths': PathSerializer(chapter.get_paths(), many=True).data
        })


class AdventurePathsView(APIView):
    permission_classes = [IsTutor]

    def post(self, request):
        serializer = PathSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        new_paths = []
        for path_data in serializer.validated_data:
            new_paths.append(Path.objects.create(from_adventure=path_data['from_adventure'],
                                                 to_adventure=path_data['to_adventure']))
        return Response(PathSerializer(new_paths, many=True).data)


class PathChoiceDescriptionView(APIView):
    permission_classes = [IsTutor]

    def post(self, request):
        serializer = NextAdventureChoiceSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        for adventure_choice in data:
            from_adventure = Adventure.objects.get(pk=adventure_choice['from_adventure'])
            NextAdventureChoiceDescription.objects.create(from_adventure=from_adventure,
                                                          description=adventure_choice['choice_description'])
            for path_choice in adventure_choice['path_choices']:
                path = Path.objects.get(from_adventure=from_adventure, to_adventure_id=path_choice['to_adventure'])
                PathChoiceDescription.objects.create(path=path, description=path_choice['path_description'])
        return Response()


class ChapterStartView(APIView):
    permission_classes = [IsStudent]

    def get(self, request, chapter_id):
        chapter = Chapter.objects.get(pk=chapter_id)
        return Response({
            'response_type': 'adventure',
            'adventure': AdventureSerializer(chapter.get_initial_adventure()).data
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
                                                               data['start_time'], data['answer_time'], closed_questions,
                                                               open_questions)
        if len(next_adventures) == 1 and next_adventures[0].is_terminal:
            return Response({
                'response_type': 'summary',
                'summary': AdventureSummarySerializer(get_summary(self.request.user, next_adventures[0]), many=True).data
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
