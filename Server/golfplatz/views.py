from django.contrib.auth.models import Group
from rest_framework.views import APIView
from rest_framework import status

from .utils import JsonResponse
from .models import Course
from .serializers import CourseSerializer, ParticipantSerializer


class CourseView(APIView):
    def get(self, request, format=None):
        serializer = CourseSerializer(Course.objects.all(), many=True)
        return JsonResponse(serializer.data).get_response()

    def post(self, request, format=None):
        course = CourseSerializer(data=request.data)
        if course.is_valid():
            course.save()
            return JsonResponse(course.data).get_response()
        else:
            return JsonResponse(course.errors, response_code=status.HTTP_400_BAD_REQUEST).get_response()


class RegisterStudent(APIView):
    def post(self, request, format=None):
        return save_participant(request, group_name='student')


class RegisterTutor(APIView):
    def post(self, request, format=None):
        return save_participant(request, group_name='tutor')


def save_participant(request, group_name):
    participant_serializer = ParticipantSerializer(data=request.data)
    if participant_serializer.is_valid():
        participant = participant_serializer.save()
        group, _ = Group.objects.get_or_create(name=group_name)
        group.user_set.add(participant)
        participant.save()
        return JsonResponse(participant_serializer.data).get_response()
    else:
        return JsonResponse(participant_serializer.errors, response_code=status.HTTP_400_BAD_REQUEST).get_response()
