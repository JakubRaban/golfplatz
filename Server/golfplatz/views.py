from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework import status

from Server.utils import JsonResponse
from golfplatz.forms import AddCourseForm


class AddCourse(APIView):
    def post(self, request, format=None):
        course = AddCourseForm(request.data)
        if course.is_valid():
            course = course.save(commit=False)
            course.user = request.user
            course.save()
            return JsonResponse({'status': 'course added'}).get_response()
        else:
            return JsonResponse({'error': course.errors}, response_code=status.HTTP_409_CONFLICT).get_response()

