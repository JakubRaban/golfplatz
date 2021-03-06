import functools
import re
from collections import defaultdict
from decimal import Decimal
from random import randint
from typing import List, Tuple, Set

from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import Max, Sum
from django.utils.timezone import now
from knox.models import AuthToken

from .managers import ParticipantManager


class Category(models.TextChoices):
    QUIZ = 'QUIZ', 'Quiz'
    GENERIC = 'GENERIC', 'Generic lab exercise'
    ACTIVENESS = 'ACTIVENESS', 'Activeness'
    TEST = 'TEST', 'Test'
    HOMEWORK = 'HOMEWORK', 'Homework or project'


def get_random_access_code(length=8):
    result = ""
    for i in range(length):
        gen = randint(0, 35)
        result += str(gen) if gen < 10 else chr(gen + 87)
    return result


def get_system_key(length=16):
    result = ""
    for i in range(length):
        gen = randint(33, 126)
        result += chr(gen)
    return result


class Participant(AbstractUser):
    phone_validator = RegexValidator(regex=r'^\d{9}$', message="Phone number must be exactly 9 digits long")

    username = None
    first_name = models.CharField('first name', max_length=30, blank=False)
    last_name = models.CharField('last name', max_length=150, blank=False)
    email = models.EmailField('email address', unique=True)
    student_number = models.CharField(max_length=10, unique=True, null=True, blank=False)

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

    def get_score_in_course(self, course):
        accomplished_chapters = AccomplishedChapter.objects.filter(
            student=self, is_completed=True, chapter__plot_part__course=course
        )
        sum_of_points = accomplished_chapters.aggregate(pts=Sum('points_scored'))['pts'] or 0
        max_score = accomplished_chapters.aggregate(pts=Sum('chapter__points_for_max_grade'))['pts'] or 0
        return sum_of_points, max_score, accomplished_chapters.count()

    def get_score_in_course_percent(self, course):
        points_scored, max_score, _ = self.get_score_in_course(course)
        return points_scored / max_score * 100 if max_score > 0 else 0

    def get_rank_in_course(self, course):
        score_percent = self.get_score_in_course_percent(course)
        ranks = list(Rank.objects.filter(course=course))
        if len(ranks) > 0:
            if score_percent <= 0:
                return ranks[0]
            for index, rank in enumerate(ranks):
                if rank.lower_threshold_percent >= score_percent:
                    return ranks[index - 1]
            return ranks[-1]
        else:
            return None


class Course(models.Model):
    class RankingVisibilityStrategy(models.TextChoices):
        FULL = 'FULL', 'Full'
        PARTICIPANT_AND_TOP = 'PARTICIPANT_AND_TOP', 'Participant and top'
        PARTICIPANT = 'PARTICIPANT', 'Participant'
        OFF = 'OFF', 'Off'

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    ranking_mode = models.CharField(
        max_length=20, choices=RankingVisibilityStrategy.choices, default=RankingVisibilityStrategy.FULL
    )
    theme_color = models.CharField(max_length=7, validators=[RegexValidator(regex=r'^#[0-9a-f]{6}$')])

    def add_course_groups(self, names: List[str]):
        return [CourseGroup.objects.create(group_name=group_name, course=self) for group_name in names]

    @property
    def max_points_possible(self):
        return sum([plot_part.max_points_possible for plot_part in self.plot_parts.all()])

    def generate_ranking_for_tutor(self):
        ranking_elements = [RankingElement(course_group_student.student, self, index + 1) for index, course_group_student in
                            enumerate(CourseGroupStudents.objects.filter(course_group__course=self))]
        ranking_elements.sort(key=lambda element: element.student_score.score_percent, reverse=True)
        ranking_elements = [RankingElement(element.student, self, index + 1) for index, element in
                            enumerate(ranking_elements)]
        return ranking_elements

    def generate_ranking_for_student(self, participant: Participant):
        if self.ranking_mode == self.RankingVisibilityStrategy.OFF:
            return []
        ranking_elements = [RankingElement(course_group_student.student, self, None) for course_group_student in
                            CourseGroupStudents.objects.filter(course_group__course=self)]
        ranking_elements.sort(key=lambda element: element.student_score.score_percent, reverse=True)
        ranking_elements = [RankingElement(element.student, self, index + 1) for index, element in
                            enumerate(ranking_elements)]
        if self.ranking_mode == self.RankingVisibilityStrategy.FULL:
            return ranking_elements
        for index, element in enumerate(ranking_elements):
            if element.student == participant:
                student_position = index
                break
        else:
            student_position = len(ranking_elements)
        if self.ranking_mode == self.RankingVisibilityStrategy.PARTICIPANT_AND_TOP:
            return [ranking_element for index, ranking_element in enumerate(ranking_elements)
                    if index <= 2 or student_position - 1 <= index <= student_position + 1]
        elif self.ranking_mode == self.RankingVisibilityStrategy.PARTICIPANT:
            return [ranking_element for index, ranking_element in enumerate(ranking_elements)
                    if student_position - 1 <= index <= student_position + 1]

    def get_all_students_grades(self, username_header_name='username'):
        acc_chapters = AccomplishedChapter.objects.filter(chapter__plot_part__course=self, is_completed=True)
        acc_chapters_values = acc_chapters.values('points_scored', 'chapter__name', 'chapter__points_for_max_grade', 'student')
        students = {student.id: student.get_full_name() for student in Participant.objects.all()}
        chapters = {value['chapter__name'] for value in acc_chapters_values}
        students_to_chapters_to_data = defaultdict(lambda: {})
        for value in acc_chapters_values:
            students_to_chapters_to_data[students[value['student']]][value['chapter__name']] = round(float(value['points_scored'] * (100 / value['chapter__points_for_max_grade'])), 3)
        score_dicts = []
        for student, grades in students_to_chapters_to_data.items():
            grades[username_header_name] = student
            score_dicts.append(grades)
        return chapters, score_dicts

    def __str__(self):
        return f'Course {self.name}'


class CourseGroup(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='course_groups')
    group_name = models.CharField(max_length=40)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, through='CourseGroupStudents')
    access_code = models.CharField(max_length=8, default=get_random_access_code)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['course', 'group_name'], name='group_name_constraint')]

    def __str__(self):
        return self.group_name


class CourseGroupStudents(models.Model):
    student = models.ForeignKey(Participant, on_delete=models.CASCADE)
    course_group = models.ForeignKey(CourseGroup, on_delete=models.CASCADE)


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
    adventure_category_included = models.CharField(max_length=10, choices=Category.choices, null=True)
    percentage = models.PositiveSmallIntegerField()
    accomplished_by_students = models.ManyToManyField('Participant', through='AccomplishedAchievement')


class AccomplishedAchievement(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    achievement = models.ForeignKey('Achievement', on_delete=models.PROTECT)
    accomplished_in_chapter = models.ForeignKey('AccomplishedChapter', on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True)


class Rank(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    lower_threshold_percent = models.PositiveSmallIntegerField()
    image = models.ImageField(null=True)

    class Meta:
        ordering = ['lower_threshold_percent']


class Weight(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    category = models.CharField(max_length=10, choices=Category.choices)
    weight = models.PositiveIntegerField()


class PlotPart(models.Model):
    name = models.CharField(max_length=100)
    introduction = models.TextField()
    is_unlocked = models.BooleanField(default=False)
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='plot_parts')
    position_in_course = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ['position_in_course']
        constraints = [
            models.UniqueConstraint(fields=['course', 'position_in_course'], name='position_in_course_constraint'),
            models.UniqueConstraint(fields=['name', 'course'], name='plot_part_name_constraint')
        ]

    def save(self, *args, **kwargs):
        if 'position_in_course' not in kwargs and not self.position_in_course:
            current_parts = PlotPart.objects.filter(course=self.course)
            last_part_index = current_parts.aggregate(index=Max('position_in_course'))['index'] or 0
            self.position_in_course = last_part_index + 1
        super(PlotPart, self).save(*args, **kwargs)

    @property
    def total_time_limit(self):
        return sum([chapter.total_time_limit for chapter in self.chapters.all()])

    @property
    def max_points_possible(self):
        return sum([chapter.max_points_possible for chapter in self.chapters.all()])

    def toggle_locked(self):
        self.is_unlocked = not self.is_unlocked
        self.save()

    def __str__(self):
        return f'Plot part {self.name} in {self.course.name}'


class Chapter(models.Model):
    name = models.CharField(max_length=100)
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
        if 'position_in_plot_part' not in kwargs and not self.position_in_plot_part:
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
        return self.points_for_max_grade

    @property
    def timed_adventures_count(self):
        return len([adventure for adventure in self.adventures.all() if adventure.has_time_limit])

    @property
    def total_time_limit(self):
        return sum([adventure.time_limit for adventure in self.adventures.all()])

    @property
    def previous_chapters(self):
        previous_plot_parts = PlotPart.objects.filter(position_in_course__lt=self.plot_part.position_in_course)
        chapters_from_prev_plot_parts = {
            plot_part: list(plot_part.chapters.filter(creating_completed=True)) for plot_part in previous_plot_parts
        }
        chapters_from_prev_plot_parts[self.plot_part] = list(
            Chapter.objects.filter(plot_part=self.plot_part, position_in_plot_part__lte=self.position_in_plot_part)
        )
        return chapters_from_prev_plot_parts

    def complete(self):
        self.creating_completed = True
        self.save()

    def uncomplete(self):
        self.creating_completed = False
        self.save()

    def __str__(self):
        return f'Chapter {self.name} in {self.plot_part.course.name}.{self.plot_part.name}'


class Adventure(models.Model):
    name = models.CharField(max_length=100)
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
    def max_points_possible(self):
        return sum(question.max_points_possible for question in self.point_source.questions.all())

    @property
    def paths_from_here(self):
        return Path.objects.filter(from_adventure=self)

    @property
    def next_adventures(self):
        return [path.to_adventure for path in self.paths_from_here]

    @property
    def has_time_limit(self):
        return self.time_limit > 0

    @property
    def is_auto_checked(self):
        return all([question.is_auto_checked for question in self.point_source.questions.all()])

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
    is_fully_graded = models.BooleanField()

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
    is_completed = models.BooleanField(default=False)
    time_started = models.DateTimeField(auto_now_add=True)
    time_completed = models.DateTimeField(null=True)
    recalculating_score_started = models.BooleanField(default=False)
    achievements_calculated = models.BooleanField(default=False)
    total_score_recalculated = models.BooleanField(default=False)

    class Meta:
        ordering = ['time_started']

    def complete(self):
        self.is_completed = True
        self.time_completed = now()
        self.save()

    def save_points_scored(self, points):
        self.points_scored = points
        self.save()

    def mark_recalculating_started(self):
        self.recalculating_score_started = True
        self.save()

    def mark_achievements_calculated(self):
        self.achievements_calculated = True
        self.save()

    def mark_total_score_recalculated(self):
        self.total_score_recalculated = True
        self.save()


class PointSource(models.Model):
    adventure = models.OneToOneField(Adventure, on_delete=models.CASCADE, primary_key=True, related_name='point_source')
    category = models.CharField(max_length=10, choices=Category.choices)


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
        IMAGE = 'IMAGE', 'Image'

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

    def grade_manually(self, points: float):
        self.points_scored = points
        self.awaiting_tutor_grading = False
        self.save()


class StudentAnswer(models.Model):
    grade = models.OneToOneField('Grade', on_delete=models.CASCADE)


class StudentTextAnswer(StudentAnswer):
    text = models.TextField()


class StudentImageAnswer(StudentAnswer):
    image = models.ImageField()


class SystemKey(models.Model):
    system_key = models.CharField(max_length=16, default=get_system_key)

    @staticmethod
    def get():
        return SystemKey.objects.all()[0].system_key if SystemKey.objects.count() > 0 else None


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


class StudentScore:
    def __init__(self, student: Participant, course: Course):
        points_scored, max_score, chapters_done = student.get_score_in_course(course)
        rank = student.get_rank_in_course(course)
        self.points_scored = points_scored
        self.max_score = max_score
        self.chapters_done = chapters_done
        self.score_percent = points_scored / max_score * 100 if max_score > 0 else 0
        self.rank = rank


class RankingElement:
    def __init__(self, student: Participant, course: Course, position: int):
        self.position = position
        self.student_score = StudentScore(student, course)
        self.student = student
        self.course_group_name = CourseGroup.objects.get(course=course, students=student).group_name


class StudentGrade:
    def __init__(self, chapter_zipped: Tuple[AccomplishedChapter, Chapter]):
        self.name = chapter_zipped[1].name
        self.points_for_max_grade = chapter_zipped[1].points_for_max_grade
        self.points_scored = chapter_zipped[0].points_scored
        self.time_completed = chapter_zipped[0].time_completed
