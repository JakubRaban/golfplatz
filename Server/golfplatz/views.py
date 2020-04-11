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
        student_serializer = ParticipantSerializer(data=request.data)
        if student_serializer.is_valid():
            student = student_serializer.save()
            group, _ = Group.objects.get_or_create(name='student')
            group.user_set.add(student)
            student.save()
            return JsonResponse(student_serializer.data).get_response()
        else:
            print(student_serializer.errors)
            return JsonResponse(student_serializer.errors, response_code=status.HTTP_400_BAD_REQUEST).get_response()


class RegisterTutor(APIView):
    def post(self, request, format=None):
        tutor_serializer = ParticipantSerializer(data=request.data)
        if tutor_serializer.is_valid():
            tutor = tutor_serializer.save()
            group, _ = Group.objects.get_or_create(name='tutor')
            group.user_set.add(tutor)
            tutor.save()
            return JsonResponse(tutor_serializer.data).get_response()
        else:
            return JsonResponse(tutor_serializer.errors, response_code=status.HTTP_400_BAD_REQUEST).get_response()
