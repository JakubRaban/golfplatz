import functools
import re
from decimal import Decimal
from typing import List, Tuple, Set

from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Max
from django.utils.timezone import now
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
        group = Group.objects.get(name=group_name)
        group.user_set.add(self)
        _, user_token = AuthToken.objects.create(self)
        return user_token

    def __str__(self):
        return f'{self.get_full_name()} ({self.email})'


class Course(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    def add_course_groups(self, names: List[str]):
        return [CourseGroup.objects.create(group_name=group_name, course=self) for group_name in names]

    def __str__(self):
        return f'Course {self.name}'


class CourseGroup(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='course_groups')
    group_name = models.CharField(max_length=40)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['course', 'group_name'], name='group_name_constraint')]

    def __str__(self):
        return self.group_name


class Achievement(models.Model):
    class CourseElementChoice(models.TextChoices):
        PLOT_PART = 'PLOT_PART', 'Plot part'
        CHAPTER = 'CHAPTER', 'Chapter'

    class ConditionType(models.TextChoices):
        SCORE = 'SCORE', 'Score'
        TIME = 'TIME', 'Time'

    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='achievements')
    name = models.CharField(max_length=100)
    image = models.ImageField(null=True)
    course_element_considered = models.CharField(max_length=10, choices=CourseElementChoice.choices)
    how_many = models.PositiveSmallIntegerField()
    in_a_row = models.BooleanField()
    condition_type = models.CharField(max_length=10, choices=ConditionType.choices)
    percentage = models.PositiveSmallIntegerField()
    accomplished_by_students = models.ManyToManyField('Participant', through='AccomplishedAchievement')


class AccomplishedAchievement(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    achievement = models.ForeignKey('Achievement', on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True)


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

    def save(self, *args, **kwargs):
        if 'position_in_course' not in kwargs:
            current_parts = PlotPart.objects.filter(course=self.course)
            last_part_index = current_parts.aggregate(index=Max('position_in_course'))['index'] or 0
            self.position_in_course = last_part_index + 1
        super(PlotPart, self).save(*args, **kwargs)

    @property
    def total_time_limit(self):
        return sum([chapter.total_time_limit for chapter in self.chapters])

    def __str__(self):
        return f'Plot part {self.name} in {self.course.name}'


class Chapter(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    plot_part = models.ForeignKey('PlotPart', on_delete=models.CASCADE, related_name='chapters')
    points_for_max_grade = models.DecimalField(max_digits=7, decimal_places=3, default=0)
    position_in_plot_part = models.PositiveSmallIntegerField()
    creating_completed = models.BooleanField(default=False)
    done_by_students = models.ManyToManyField('Participant', through='AccomplishedChapter')

    class Meta:
        ordering = ['position_in_plot_part']
        constraints = [
            models.UniqueConstraint(fields=['plot_part', 'position_in_plot_part'],
                                    name='position_in_plot_part_constraint'),
            models.UniqueConstraint(fields=['name', 'plot_part'], name='chapter_name_constraint')
        ]

    def save(self, *args, **kwargs):
        if 'position_in_plot_part' not in kwargs:
            current_chapters = Chapter.objects.filter(plot_part=self.plot_part)
            last_part_index = current_chapters.aggregate(index=Max('position_in_plot_part'))['index'] or 0
            self.position_in_plot_part = last_part_index + 1
        super(Chapter, self).save(*args, **kwargs)

    @property
    def paths(self):
        adventures = self.adventures.all()
        paths = []
        for adventure in adventures:
            paths.extend(Path.objects.filter(from_adventure=adventure))
        return paths

    @property
    def choices(self):
        adventures = self.adventures.all()
        return list(filter(None, [NextAdventureChoice.for_adventure(adventure) for adventure in adventures]))

    @property
    def initial_adventure(self):
        return self.adventures.get(is_initial=True)

    @property
    def course(self):
        return self.plot_part.course

    @property
    def is_last_in_plot_part(self):
        chapters_from_current_plot_part = Chapter.objects.filter(plot_part=self.plot_part)
        return self.position_in_plot_part == chapters_from_current_plot_part.aggregate(index=Max('position_in_plot_part'))['index']

    @property
    def max_points_possible(self):
        return sum([adventure.max_points_possible for adventure in self.adventures])

    @property
    def timed_adventures_count(self):
        return len([adventure for adventure in self.adventures if adventure.has_time_limit])

    @property
    def total_time_limit(self):
        return sum([adventure.time_limit for adventure in self.adventures])

    def complete(self):
        self.creating_completed = True
        self.save()

    def __str__(self):
        return f'Chapter {self.name} in {self.plot_part.course.name}.{self.plot_part.name}'


class Adventure(models.Model):
    name = models.CharField(max_length=50)
    chapter = models.ForeignKey('Chapter', on_delete=models.CASCADE, related_name='adventures')
    task_description = models.TextField()
    is_initial = models.BooleanField(default=False)
    time_limit = models.PositiveIntegerField(default=0)
    done_by_students = models.ManyToManyField('Participant', through='AccomplishedAdventure')

    class Meta:
        constraints = [models.UniqueConstraint(fields=['chapter', 'name'], name='adventure_name_constraint')]

    def get_time_modifier(self, time_in_seconds: int):
        hundred_percent = 100
        timer_rules = list(self.timer_rules.order_by('rule_end_time'))
        if not timer_rules:
            return hundred_percent
        for index, timer_rule in enumerate(timer_rules):
            if time_in_seconds > timer_rule.rule_end_time:
                continue
            if timer_rule.decreasing_method == TimerRule.DecreasingMethod.NONE:
                return timer_rule.least_points_awarded_percent
            elif timer_rule.decreasing_method == TimerRule.DecreasingMethod.LINEAR:
                previous_rule = timer_rules[index - 1] if index > 0 else None
                modifier_at_rule_start = previous_rule.least_points_awarded_percent if previous_rule else hundred_percent
                time_at_rule_start = previous_rule.rule_end_time if previous_rule else 0
                a, b = Adventure.line_through_points((time_at_rule_start, modifier_at_rule_start),
                                                     (timer_rule.rule_end_time, timer_rule.least_points_awarded_percent))
                return int(a * time_in_seconds + b)
        else:
            return timer_rules[-1].least_points_awarded_percent if self.time_limit > 0 else 0

    @staticmethod
    def line_through_points(p1: Tuple[int, int], p2: Tuple[int, int]) -> Tuple:
        a = (p1[1] - p2[1]) / (p1[0] - p2[0])
        b = p1[1] - a * p1[0]
        return a, b

    @property
    def paths_from_here(self):
        return Path.objects.filter(from_adventure=self)

    @property
    def next_adventures(self):
        return [path.to_adventure for path in self.paths_from_here]

    @property
    def max_points_possible(self):
        return sum([question.max_points_possible for question in self.point_source.questions])

    @property
    def has_time_limit(self):
        return self.time_limit > 0

    def __str__(self):
        return f'Adventure {self.name} in {self.chapter.plot_part.course.name}.{self.chapter.plot_part.name}.' \
               f'{self.chapter.name}'


class TimerRule(models.Model):
    class DecreasingMethod(models.TextChoices):
        LINEAR = 'LIN', 'Linear'
        NONE = 'NONE', 'None'

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['rule_end_time', 'adventure'], name='single_rule_for_end_time_in_adventure')
        ]

    adventure = models.ForeignKey('Adventure', on_delete=models.CASCADE, related_name='timer_rules')
    least_points_awarded_percent = models.PositiveSmallIntegerField()
    rule_end_time = models.PositiveSmallIntegerField()
    decreasing_method = models.CharField(max_length=4, choices=DecreasingMethod.choices, default=DecreasingMethod.NONE)


class Path(models.Model):
    from_adventure = models.ForeignKey('Adventure', related_name='from_adventure', on_delete=models.CASCADE)
    to_adventure = models.ForeignKey('Adventure', related_name='to_adventure', on_delete=models.CASCADE)


class NextAdventureChoiceDescription(models.Model):
    from_adventure = models.OneToOneField('Adventure', primary_key=True, on_delete=models.CASCADE)
    description = models.TextField()


class PathChoiceDescription(models.Model):
    path = models.OneToOneField('Path', primary_key=True, on_delete=models.CASCADE)
    description = models.TextField()


class AccomplishedAdventure(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    adventure = models.ForeignKey('Adventure', on_delete=models.PROTECT)
    adventure_started_time = models.DateTimeField()
    time_elapsed_seconds = models.PositiveSmallIntegerField()
    total_points_for_questions_awarded = models.DecimalField(max_digits=7, decimal_places=3)
    applied_time_modifier_percent = models.PositiveSmallIntegerField()

    @property
    def points_after_applying_modifier(self):
        return self.total_points_for_questions_awarded * self.applied_time_modifier_percent / 100

    class Meta:
        ordering = ['adventure_started_time']
        constraints = [
            models.UniqueConstraint(fields=['student', 'adventure'], name='student_accomplishes_adventure_once')
        ]


class AccomplishedChapter(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    chapter = models.ForeignKey('Chapter', on_delete=models.PROTECT)
    points_scored = models.DecimalField(max_digits=7, decimal_places=3, null=True)
    average_time_taken_percent = models.PositiveSmallIntegerField(null=True)
    is_completed = models.BooleanField(default=False)
    time_started = models.DateTimeField(auto_now_add=True)
    time_completed = models.DateTimeField(null=True)
    new_achievements_count = models.PositiveSmallIntegerField(null=True)

    class Meta:
        ordering = ['time_started']

    def complete(self, points_scored, average_time_taken_percent):
        self.points_scored = points_scored
        self.average_time_taken_percent = average_time_taken_percent
        self.is_completed = True
        self.time_completed = now()
        self.save()


class PointSource(models.Model):
    class Category(models.TextChoices):
        QUIZ = 'QUIZ', 'Quiz'
        SURPRISE_EXERCISE = 'SURPRISE', 'Surprise exercise'
        GENERIC = 'GENERIC', 'Generic lab exercise'
        ACTIVENESS = 'ACTIVENESS', 'Activeness'
        TEST = 'TEST', 'Test'
        HOMEWORK = 'HOMEWORK', 'Homework or project'

    adventure = models.OneToOneField(Adventure, on_delete=models.CASCADE, primary_key=True, related_name='point_source')
    category = models.CharField(max_length=10, choices=Category.choices)


class SurpriseExercise(models.Model):
    class SendMethod(models.TextChoices):
        EMAIL = 'EMAIL', 'Email'
        PHONE = 'PHONE', 'Phone'

    point_source = models.OneToOneField(PointSource, on_delete=models.CASCADE, primary_key=True,
                                        related_name='surprise_exercise')
    earliest_possible_send_time = models.DateTimeField()
    latest_possible_send_time = models.DateTimeField()
    sending_method = models.CharField(max_length=5, choices=SendMethod.choices)


class Answer(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=250)
    is_correct = models.BooleanField()
    is_regex = models.BooleanField(default=False)


class Question(models.Model):
    class Type(models.TextChoices):
        OPEN = 'OPEN', 'Open question'
        CLOSED = 'CLOSED', 'Closed question'

    class InputType(models.TextChoices):
        TEXT_FIELD = 'TEXTFIELD', 'Small text field'
        TEXT_AREA = 'TEXTAREA', 'Large text area'

    point_source = models.ForeignKey('PointSource', on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=250)
    question_type = models.CharField(max_length=6, choices=Type.choices)
    is_multiple_choice = models.BooleanField(default=False)
    is_auto_checked = models.BooleanField()
    input_type = models.CharField(max_length=9, choices=InputType.choices, default=InputType.TEXT_FIELD)
    points_per_correct_answer = models.DecimalField(max_digits=6, decimal_places=3, default=1.0)
    points_per_incorrect_answer = models.DecimalField(max_digits=6, decimal_places=3, default=0.0)
    message_after_correct_answer = models.TextField(blank=True)
    message_after_incorrect_answer = models.TextField(blank=True)
    grades = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Grade')

    class Meta:
        ordering = ['id']

    def _points_for_answer(self, answer: Answer, invert: bool = False) -> Decimal:
        return self.points_per_correct_answer if answer.is_correct ^ invert else self.points_per_incorrect_answer

    def score_for_closed_question(self, given_answers: Set[Answer]) -> Decimal:
        if not given_answers:
            return self.points_per_incorrect_answer
        if not self.is_multiple_choice:
            return self._points_for_answer(given_answers.pop())
        else:
            all_answers = self.answers.all()
            unchecked_answers = set(all_answers) - set(given_answers)
            points_scored = functools.reduce(lambda acc, answer: acc + self._points_for_answer(answer), given_answers, 0)
            points_scored = functools.reduce(lambda acc, answer: acc + self._points_for_answer(answer, invert=True),
                                             unchecked_answers, points_scored)
            return points_scored

    def score_for_open_question(self, given_answer: str) -> Decimal:
        is_correct = False
        for correct_answer in self.answers.all():
            if not correct_answer.is_regex:
                is_correct = given_answer.lower() == correct_answer.text.lower()
            else:
                is_correct = re.compile(fr"^{correct_answer.text}$", re.IGNORECASE).match(given_answer)
            if is_correct:
                break
        return self.points_per_correct_answer if is_correct else self.points_per_incorrect_answer

    @property
    def max_points_possible(self) -> Decimal:
        if not self.is_multiple_choice:
            return self.points_per_correct_answer
        else:
            return self.points_per_correct_answer * self.answers.count()

    @property
    def adventure(self):
        return self.point_source.adventure

    @property
    def is_open(self) -> bool:
        return self.question_type == Question.Type.OPEN


class Grade(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    question = models.ForeignKey('Question', on_delete=models.PROTECT)
    points_scored = models.DecimalField(max_digits=6, decimal_places=3)
    awaiting_tutor_grading = models.BooleanField(default=False)


class PathChoice:
    def __init__(self, **kwargs):
        self.to_adventure: Adventure = kwargs['to_adventure']
        self.description: str = kwargs['description']


class NextAdventureChoice:
    def __init__(self, **kwargs):
        self.from_adventure: Adventure = kwargs['from_adventure']
        self.description: str = kwargs['description']
        self.path_choices: List[PathChoice] = kwargs['path_choices']

    @staticmethod
    def for_adventure(adventure: Adventure):
        paths = adventure.paths_from_here
        try:
            path_choices = [PathChoice(to_adventure=path.to_adventure,
                                       description=path.pathchoicedescription.description) for path in paths]
            self = NextAdventureChoice(from_adventure=adventure,
                                       description=adventure.nextadventurechoicedescription.description,
                                       path_choices=path_choices)
            return self
        except (Path.pathchoicedescription.RelatedObjectDoesNotExist,
                Adventure.nextadventurechoicedescription.RelatedObjectDoesNotExist):
            return None


class QuestionSummary:
    def __init__(self, **kwargs):
        self.text = kwargs['text']
        self.is_auto_checked = kwargs['is_auto_checked']
        self.points_scored = kwargs['points_scored']
        self.max_points = kwargs['max_points']


class AdventureSummary:
    def __init__(self, **kwargs):
        self.adventure_name = kwargs['adventure_name']
        self.answer_time = kwargs['answer_time']
        self.time_modifier = kwargs['time_modifier']
        self.question_summaries = kwargs['question_summaries']
