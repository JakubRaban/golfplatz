from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework import status

from .utils import JsonResponse
from .models import Course
from .serializers import CourseSerializer


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
            return JsonResponse(course.errors, response_code=status.HTTP_409_CONFLICT).get_response()

