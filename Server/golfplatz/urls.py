from django.urls import path

from .views import CourseView, RegisterStudent, RegisterTutor

urlpatterns = [
    path('courses/', CourseView.as_view()),
    path('register/tutor', RegisterTutor.as_view()),
    path('register/student', RegisterStudent.as_view()),
]
