from django.urls import path
from knox import views as knox_views

from .views import CourseView, RegisterStudentView, RegisterTutorView, LoginView, WhoAmIView, CourseGroupView, \
    PlotPartView, SpecificPlotPartView, ChapterView, SpecificChapterView, AdventureView, AdventurePathsView, \
    PathChoiceDescriptionView

urlpatterns = [
    path('register/tutor/', RegisterTutorView.as_view()),
    path('register/student/', RegisterStudentView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('whoami/', WhoAmIView.as_view()),

    path('courses/', CourseView.as_view()),
    path('courses/<int:course_id>/', CourseView.as_view()),
    path('courses/<int:course_id>/course_groups/', CourseGroupView.as_view()),
    path('courses/<int:course_id>/plot_parts/', PlotPartView.as_view()),

    path('plot_parts/<int:plot_part_id>/', SpecificPlotPartView.as_view()),
    path('plot_parts/<int:plot_part_id>/chapters/', ChapterView.as_view()),

    path('chapters/<int:chapter_id>/', SpecificChapterView.as_view()),
    path('chapters/<int:chapter_id>/adventures/', AdventureView.as_view()),
    path('adventures/paths/', AdventurePathsView.as_view()),
    path('adventures/choice_descriptions/', PathChoiceDescriptionView.as_view()),

]
