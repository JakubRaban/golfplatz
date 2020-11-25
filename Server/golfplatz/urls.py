from django.urls import path
from knox import views as knox_views

from .views import *

urlpatterns = [

    path('register/tutor/', RegisterTutorView.as_view()),
    path('register/student/', RegisterStudentView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('whoami/', WhoAmIView.as_view()),

    path('courses/', CourseView.as_view()),
    path('courses/flat/', CourseListView.as_view()),
    path('courses/<int:course_id>/', CourseView.as_view()),
    path('courses/<int:course_id>/course_groups/', CourseGroupView.as_view()),
    path('course_groups/enroll/<str:access_code>/', CourseGroupEnrollmentView.as_view()),
    path('courses/<int:course_id>/plot_parts/', PlotPartView.as_view()),

    path('plot_parts/<int:plot_part_id>/', SpecificPlotPartView.as_view()),
    path('plot_parts/<int:plot_part_id>/toggle_lock/', TogglePlotPartLockView.as_view()),
    path('plot_parts/<int:plot_part_id>/chapters/', ChapterView.as_view()),

    path('chapters/<int:chapter_id>/', SpecificChapterView.as_view()),
    path('chapters/<int:chapter_id>/adventures/', AdventureView.as_view()),
    path('adventures/<int:pk>/', UpdateAdventureView.as_view()),
    path('chapters/<int:chapter_id>/submit/', ChapterSubmissionView.as_view()),
    path('chapters/<int:chapter_id>/submit-draft/', ChapterDraftSubmissionView.as_view()),

    path('play/start/<int:chapter_id>/', ChapterStartView.as_view()),
    path('play/answer/<int:adventure_id>/', AdventureAnswerView.as_view()),
    path('play/path_choice/<int:to_adventure_id>/', NextAdventureChoiceView.as_view()),
    path('play/desist/', WhoAmIView.as_view()),
    path('play/adventure_timeout/', WhoAmIView.as_view()),
    path('play/chapter_timeout/', WhoAmIView.as_view()),

    path('chapters/<int:chapter_id>/new_achievements/', NewAchievementsAfterChapterView.as_view()),
    path('courses/<int:course_id>/achievements/', AchievementView.as_view()),
    path('courses/<int:course_id>/accomplished_achievements/', StudentAccomplishedAchievementsView.as_view()),
    path('courses/<int:course_id>/ranks/', RankView.as_view()),
    path('courses/<int:course_id>/weights/', WeightsView.as_view()),
    path('chapters/<int:chapter_id>/new_score/', ScoreAfterChapterView.as_view()),
    path('courses/<int:course_id>/score/', ParticipantScoreView.as_view()),
    path('courses/<int:course_id>/ranking/', CourseRankingView.as_view()),
    path('courses/<int:course_id>/student_grades/', StudentGradesView.as_view()),
    path('courses/<int:course_id>/course_structure/', CourseStructureView.as_view()),
    path('courses/<int:course_id>/grades/unchecked/', CourseNameView.as_view()),
    path('courses/<int:course_id>/grades/all/', CourseAllStudentsGradesView.as_view()),
    path('courses/<int:course_id>/grades/export/csv/', GradeExportView.as_view()),

    path('manual_grading/<adventure_id>/', ManualGradingView.as_view()),

]
