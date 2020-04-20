
from knox.models import AuthToken
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course
from .permissions import IsTutor
from .serializers import CourseSerializer, ParticipantSerializer, LoginSerializer, CourseGroupSerializer


class CourseView(APIView):
    permission_classes = [IsTutor]

    def get(self, request, format=None):
        serializer = CourseSerializer(Course.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        course = CourseSerializer(data=request.data)
        if course.is_valid():
            course.save()
            return Response(course.data)
        else:
            return Response(course.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterStudentView(APIView):
    def post(self, request):
        return save_participant(request, group_name='student')


class RegisterTutorView(APIView):
    def post(self, request):
        return save_participant(request, group_name='tutor')


def save_participant(request, group_name):
    participant_serializer = ParticipantSerializer(data=request.data)
    participant_serializer.is_valid(raise_exception=True)
    participant = participant_serializer.validated_data
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
    pass


class WhoAmIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipantSerializer

    def get_object(self):
        return self.request.user
