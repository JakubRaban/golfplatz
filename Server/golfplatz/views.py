from rest_framework.views import APIView
from rest_framework import status

from Server.utils import JsonResponse
from golfplatz.forms import AddCourseForm, RegisterStudentForm, RegisterTutorForm


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


class RegisterStudent(APIView):
    def post(self, request, format=None):
        student = RegisterStudentForm(request.data)
        if student.is_valid():
            student.save()
            return JsonResponse({'status': 'student registered'}).get_response()
        else:
            return JsonResponse({'error': student.errors}, response_code=status.HTTP_409_CONFLICT).get_response()


class RegisterTutor(APIView):
    def post(self, request, format=None):
        tutor = RegisterTutorForm(request.data)
        if tutor.is_valid():
            tutor.save()
            return JsonResponse({'status': 'tutor registered'}).get_response()
        else:
            return JsonResponse({'error': tutor.errors}, response_code=status.HTTP_409_CONFLICT).get_response()
