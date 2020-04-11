from django.urls import path

from golfplatz.views import AddCourse, RegisterStudent, RegisterTutor

urlpatterns = [
    path('course/add/', AddCourse.as_view()),
    path('register/tutor', RegisterTutor.as_view()),
    path('register/student', RegisterStudent.as_view()),
]
