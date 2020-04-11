from rest_framework.views import APIView
from rest_framework import status

from .utils import JsonResponse
from .models import Course
from .serializers import CourseSerializer
from .forms import AddCourseForm, RegisterStudentForm, RegisterTutorForm


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
