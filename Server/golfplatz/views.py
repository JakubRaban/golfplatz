from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

from Server.utils import JsonResponse
from golfplatz.forms import AddCourseForm


class AddCourse(APIView):
    def post(self, request, format=None):
        course = AddCourseForm(request.POST)

        if course.is_valid():
            course = course.save(commit=False)
            course.user = request.user
            course.save()
            return JsonResponse({'status': 'add new restaurant'}).parse()
        else:
            return JsonResponse({'errors': course.errors}, status=False).parse()

