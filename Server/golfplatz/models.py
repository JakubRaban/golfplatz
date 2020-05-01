from typing import List

from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import RegexValidator
from django.db import models
from django.conf import settings
from django.db.models import Max
from knox.models import AuthToken

from .managers import ParticipantManager


class Participant(AbstractUser):
    phone_validator = RegexValidator(regex=r'^\d{9}$', message="Phone number must be exactly 9 digits long")

    username = None
    first_name = models.CharField('first name', max_length=30, blank=False)
    last_name = models.CharField('last name', max_length=150, blank=False)
    email = models.EmailField('email address', unique=True)
    student_number = models.CharField(max_length=10, unique=True, null=True, blank=False)
    phone_number = models.CharField(validators=[phone_validator], max_length=9, unique=True, null=True, blank=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = ParticipantManager()

    def register(self, group_name):
        group, _ = Group.objects.get(name=group_name)
        group.user_set.add(self)
        _, user_token = AuthToken.objects.create(self)
        return user_token

    def __str__(self):
        return f'{self.get_full_name()} ({self.email})'


class Course(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    def add_plot_part(self, **kwargs):
        new_plot_part = PlotPart(name=kwargs['name'], introduction=kwargs['introduction'], course=self)
        current_parts = PlotPart.objects.filter(course=self)
        last_part_index = current_parts.aggregate(index=Max('position_in_course'))['index'] or 0
        new_plot_part.position_in_course = last_part_index + 1
        new_plot_part.save()
        return new_plot_part

    def add_course_groups(self, names: List[str]):
        return [CourseGroup.objects.create(group_name=group_name, course=self) for group_name in names]

    def __str__(self):
        return f'Course {self.name}'


class AutoCheckedGrade(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    points_scored = models.DecimalField(max_digits=6, decimal_places=3)


class TutorCheckedGrade(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tutor_checked_source = models.ForeignKey('TutorCheckedPointSource', on_delete=models.CASCADE)
    points_scored = models.DecimalField(max_digits=6, decimal_places=3)


class CourseGroup(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='course_groups')
    group_name = models.CharField(max_length=40)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['course', 'group_name'], name='group_name_constraint')]

    def __str__(self):
        return self.group_name


class PlotPart(models.Model):
    name = models.CharField(max_length=50)
    introduction = models.TextField()
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='plot_parts')
    position_in_course = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['position_in_course']
        constraints = [
            models.UniqueConstraint(fields=['course', 'position_in_course'], name='position_in_course_constraint'),
            models.UniqueConstraint(fields=['name', 'course'], name='plot_part_name_constraint')
        ]

    def add_chapter(self, **kwargs):
        new_chapter = Chapter(name=kwargs['name'], description=kwargs['description'], plot_part=self)
        current_chapters = Chapter.objects.filter(plot_part=self)
        last_part_index = current_chapters.aggregate(index=Max('position_in_plot_part'))['index'] or 0
        new_chapter.position_in_plot_part = last_part_index + 1
        new_chapter.save()
        return new_chapter

    def __str__(self):
        return f'Plot part {self.name} in {self.course.name}'


class Chapter(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    plot_part = models.ForeignKey('PlotPart', on_delete=models.CASCADE, related_name='chapters')
    position_in_plot_part = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['position_in_plot_part']
        constraints = [
            models.UniqueConstraint(fields=['plot_part', 'position_in_plot_part'],
                                    name='position_in_plot_part_constraint'),
            models.UniqueConstraint(fields=['name', 'plot_part'], name='chapter_name_constraint')
        ]

    def add_adventure(self, name, description):
        new_adventure = Adventure(name=name, task_description=description, chapter=self)
        if not self.adventure_set.all():
            new_adventure.is_initial = True
        new_adventure.save()

    def __str__(self):
        return f'Chapter {self.name} in {self.plot_part.course.name}.{self.plot_part.name}'


class Adventure(models.Model):
    name = models.CharField(max_length=50)
    chapter = models.ForeignKey('Chapter', on_delete=models.CASCADE)
    point_source = models.OneToOneField('PointSource', on_delete=models.PROTECT, null=True, default=None)
    task_description = models.TextField()
    is_initial = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['chapter', 'name'], name='adventure_name_constraint')]

    def attach_point_source(self):
        raise NotImplemented()

    def add_timer_rule(self):
        raise NotImplemented()

    def __str__(self):
        return f'Adventure {self.name} in {self.chapter.plot_part.course.name}.{self.chapter.plot_part.name}.\
               {self.chapter.name}'


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
    message_after_correct_answer = models.TextField()
    message_after_incorrect_answer = models.TextField()
    question_type = models.CharField(max_length=6, choices=Type.choices)
    point_source = models.ForeignKey('AutoCheckedPointSource', on_delete=models.CASCADE)
    auto_checked_grades = models.ManyToManyField(settings.AUTH_USER_MODEL, through='AutoCheckedGrade')


class Answer(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    text = models.CharField(max_length=250)
    is_correct = models.BooleanField()
    is_regex = models.BooleanField(default=False)
