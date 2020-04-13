from django.contrib.auth.models import Group
from rest_framework.views import APIView
from rest_framework import status, permissions, generics
from knox.models import AuthToken

from .utils import JsonResponse
from .models import Course
from .serializers import CourseSerializer, ParticipantSerializer, LoginSerializer


class CourseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        serializer = CourseSerializer(Course.objects.all(), many=True)
        return JsonResponse(serializer.data)

    def post(self, request, format=None):
        course = CourseSerializer(data=request.data)
        if course.is_valid():
            course.save()
            return JsonResponse(course.data)
        else:
            return JsonResponse(course.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterStudentView(APIView):
    def post(self, request):
        return save_participant(request, group_name='student')


class RegisterTutorView(APIView):
    def post(self, request):
        return save_participant(request, group_name='tutor')


def save_participant(request, group_name):
    participant_serializer = ParticipantSerializer(data=request.data)
    if participant_serializer.is_valid():
        participant = participant_serializer.save()
        group, _ = Group.objects.get_or_create(name=group_name)
        group.user_set.add(participant)
        _, user_token = AuthToken.objects.create(participant)
        return JsonResponse({
            "user": participant_serializer.data,
            "token": user_token
        })
    else:
        return JsonResponse(participant_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)
        user = login_serializer.validated_data
        _, user_token = AuthToken.objects.create(user)
        return JsonResponse({
            "user": ParticipantSerializer(user).data,
            "token": user_token
        })


class WhoAmIView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ParticipantSerializer

    def get_object(self):
        return self.request.user
