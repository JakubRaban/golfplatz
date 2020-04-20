from django.urls import path
from knox import views as knox_views

from .views import CourseView, RegisterStudentView, RegisterTutorView, LoginView, WhoAmIView, CourseGroupView, \
    PlotPartView

urlpatterns = [
    path('register/tutor/', RegisterTutorView.as_view()),
    path('register/student/', RegisterStudentView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('courses/', CourseView.as_view()),
    path('courses/<int:course_id>/course_groups/', CourseGroupView.as_view()),
    # path('courses/<int:course_id>/plot_parts/', PlotPartView.as_view()),
    path('whoami/', WhoAmIView.as_view()),
]
