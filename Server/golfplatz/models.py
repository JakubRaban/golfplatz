from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.conf import settings
from .managers import ParticipantManager


class Course(models.Model):
    course_name = models.CharField(max_length=100)
    description = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)


class Participant(AbstractUser):
    phone_validator = RegexValidator(regex=r'^\d{9}$', message="Phone number must be exactly 9 digits long")

    username = None
    email = models.EmailField('email address', unique=True)
    student_number = models.CharField(max_length=10, unique=True, null=True)
    phone_number = models.CharField(validators=[phone_validator], max_length=9, unique=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = ParticipantManager()

    def __str__(self):
        return self.get_full_name() + ' (' + self.email + ')'


class AutoCheckedGrade(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    points_scored = models.DecimalField(max_digits=6, decimal_places=3)


class TutorCheckedGrade(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tutor_checked_source = models.ForeignKey('TutorCheckedPointSource', on_delete=models.CASCADE)
    points_scored = models.DecimalField(max_digits=6, decimal_places=3)


class CourseGroup(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    group_name = models.CharField(max_length=40)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL)


class PlotPart(models.Model):
    name = models.CharField(max_length=50)
    introduction = models.TextField()
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    position_in_course = models.PositiveSmallIntegerField()


class Chapter(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    plot_part = models.ForeignKey('PlotPart', on_delete=models.CASCADE)
    position_in_plot_part = models.PositiveSmallIntegerField()
    initial_adventure = models.ForeignKey('Adventure', on_delete=models.PROTECT)


class Adventure(models.Model):
    name = models.CharField(max_length=50)
    point_source = models.OneToOneField('PointSource', on_delete=models.PROTECT)
    task_description = models.TextField()
    message_after_correct_answer = models.TextField()
    message_after_incorrect_answer = models.TextField()


class TimerRule(models.Model):
    class DecreasingMethod(models.TextChoices):
        LINEAR = 'LIN', 'Linear'
        NONE = 'NONE', 'None'

    adventure = models.ForeignKey('Adventure', on_delete=models.CASCADE)
    least_points_awarded_percent = models.PositiveSmallIntegerField()
    rule_end_time = models.PositiveSmallIntegerField()
    decreasing_method = models.CharField(max_length=4, choices=DecreasingMethod.choices, default=DecreasingMethod.NONE)


class Path(models.Model):
    from_adventure = models.ForeignKey('Adventure', related_name='from_adventure', on_delete=models.CASCADE)
    to_adventure = models.ForeignKey('Adventure', related_name='to_adventure', on_delete=models.CASCADE)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, through='PathCoverage')


class PathCoverage(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    path = models.ForeignKey('Path', on_delete=models.CASCADE)
    adventure_started_time = models.DateTimeField()
    time_elapsed_seconds = models.PositiveSmallIntegerField()


class PointSource(models.Model):
    pass


class AutoCheckedPointSource(PointSource):
    class Category(models.TextChoices):
        QUIZ = 'QUIZ', 'Quiz'
        SURPRISE_EXERCISE = 'SURPRISE', 'Surprise exercise'
        GENERIC = 'GENERIC', 'Generic lab exercise'

    point_source_category = models.CharField(max_length=8, choices=Category.choices)


class TutorCheckedPointSource(PointSource):
    class Category(models.TextChoices):
        ACTIVENESS = 'ACTIVENESS', 'Activeness'
        TEST = 'TEST', 'Test'
        HOMEWORK = 'HOMEWORK', 'Homework or project'

    class InputType(models.TextChoices):
        NONE = 'NONE', 'None'
        TEXT_FIELD = 'TEXTFIELD', 'Small text field'
        TEXT_AREA = 'TEXTAREA', 'Large text area'

    max_points = models.DecimalField(max_digits=6, decimal_places=3)
    category = models.CharField(max_length=10, choices=Category.choices)
    input_type = models.CharField(max_length=9, choices=InputType.choices, default=InputType.NONE)
    tutor_checked_grades = models.ManyToManyField(settings.AUTH_USER_MODEL, through='TutorCheckedGrade')


class SurpriseExercise(AutoCheckedPointSource):
    class SendMethod(models.TextChoices):
        EMAIL = 'EMAIL', 'Email'
        PHONE = 'PHONE', 'Phone'

    earliest_possible_send_time = models.DateTimeField()
    latest_possible_send_time = models.DateTimeField()
    sending_method = models.CharField(max_length=5, choices=SendMethod.choices)


class Question(models.Model):
    class Type(models.TextChoices):
        OPEN = 'OPEN', 'Open question'
        CLOSED = 'CLOSED', 'Closed question'

    text = models.CharField(max_length=250)
    points_per_correct_answer = models.DecimalField(max_digits=6, decimal_places=3)
    points_per_incorrect_answer = models.DecimalField(max_digits=6, decimal_places=3)
    question_type = models.CharField(max_length=6, choices=Type.choices)
    point_source = models.ForeignKey('AutoCheckedPointSource', on_delete=models.CASCADE)
    auto_checked_grades = models.ManyToManyField(settings.AUTH_USER_MODEL, through='AutoCheckedGrade')


class Answer(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    text = models.CharField(max_length=250)
    is_correct = models.BooleanField()
    is_regex = models.BooleanField(default=False)
