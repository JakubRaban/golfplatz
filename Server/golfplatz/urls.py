from django.urls import path

from golfplatz.views import AddCourse

urlpatterns = [
    path('course/add/', AddCourse.as_view()),
]
