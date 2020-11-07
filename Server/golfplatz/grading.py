from typing import Set, List, Tuple, Dict
from collections import defaultdict

import base64

from .models import Participant, Adventure, AccomplishedAdventure, Chapter, PlotPart, Course, Question, \
    Grade, Answer, StudentImageAnswer, StudentTextAnswer


def points_for_accomplished_adventures(acc_adventures: Set[AccomplishedAdventure]):
    return sum([acc_adventure.points_after_applying_modifier for acc_adventure in acc_adventures])


def points_for_adventure(student: Participant, adventure: Adventure):
    acc_adventure = AccomplishedAdventure.objects.filter(adventure=adventure, student=student)
    return points_for_accomplished_adventures(acc_adventure)


def points_for_chapter(student: Participant, chapter: Chapter):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__in=chapter.adventures.all(), student=student)
    return points_for_accomplished_adventures(acc_adventures)


def points_for_plot_part(student: Participant, plot_part: PlotPart):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__in=plot_part.chapters.all(),
                                                          student=student)
    return points_for_accomplished_adventures(acc_adventures)


def points_for_course(student: Participant, course: Course):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__plot_part__in=course.plot_parts.all(),
                                                          student=student)
    return points_for_accomplished_adventures(acc_adventures)


def points_for_adventure_percent(student: Participant, adventure: Adventure):
    return points_for_adventure(student, adventure) / adventure.max_points_possible * 100


def points_for_chapter_percent(student: Participant, chapter: Chapter):
    return points_for_chapter(student, chapter) / chapter.max_points_possible * 100


def points_for_plot_part_percent(student: Participant, plot_part: PlotPart):
    return points_for_plot_part(student, plot_part) / plot_part.max_points_possible * 100


def points_for_course_percent(student: Participant, course: Course):
    return points_for_course(student, course) / course.max_points_possible * 100


def time_taken_for_time_bound_accomplished_adventures(acc_adventures: Set[AccomplishedAdventure]):
    return sum([acc_adventure.time_elapsed_seconds for acc_adventure in acc_adventures if
                acc_adventure.adventure.has_time_limit])


def total_time_limit_for_accomplished_adventures(acc_adventures: Set[AccomplishedAdventure]):
    return sum([acc_adventure.adventure.time_limit for acc_adventure in acc_adventures])


def time_taken_for_accomplished_adventures_percent(acc_adventures: Set[AccomplishedAdventure]):
    total_time = total_time_limit_for_accomplished_adventures(acc_adventures)
    if total_time:
        return time_taken_for_time_bound_accomplished_adventures(acc_adventures) / total_time * 100
    else:
        return 0


def average_time_taken_in_chapter_percent(student: Participant, chapter: Chapter):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter=chapter, student=student)
    return time_taken_for_accomplished_adventures_percent(acc_adventures)


def average_time_taken_in_plot_part_percent(student: Participant, plot_part: PlotPart):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__plot_part=plot_part, student=student)
    return time_taken_for_accomplished_adventures_percent(acc_adventures)


def grade_answers(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]],
                  open_question_answers: List[Tuple[Question, str]],
                  image_question_answers: List[Tuple[Question, str]]) -> float:
    sum_of_points = 0.0
    for question_answer_type in (closed_question_answers, open_question_answers, image_question_answers):
        for question_answer in question_answer_type:
            question = question_answer[0]
            given_answer = question_answer[1]
            if not question.is_auto_checked:
                new_grade = Grade.objects.create(student=participant, question=question, points_scored=0,
                                                 awaiting_tutor_grading=True)
                if question_answer in image_question_answers:
                    StudentImageAnswer.objects.create(grade=new_grade, image=base64.b64decode(given_answer))
                else:
                    StudentTextAnswer.objects.create(grade=new_grade, text=given_answer)
            else:
                if question_answer in closed_question_answers:
                    question_points_scored = question.score_for_closed_question(given_answer)
                else:
                    question_points_scored = question.score_for_open_question(given_answer)
                Grade.objects.create(student=participant, question=question, points_scored=question_points_scored)
                sum_of_points += float(question_points_scored)
    return sum_of_points


class ScoreAggregator:
    def __init__(self, acc_adventures: List[Dict]):
        self.acc_adventures = acc_adventures
        self.adventures_by_plot_parts = defaultdict(lambda: [])
        self.adventures_by_chapters = defaultdict(lambda: [])
        for acc_adventure in acc_adventures:
            plot_part = acc_adventure['adventure__chapter__plot_part']
            chapter = acc_adventure['adventure__chapter']
            self.adventures_by_plot_parts[plot_part].append(acc_adventure)
            self.adventures_by_chapters[chapter].append(acc_adventure)

    @staticmethod
    def points_for_accomplished_adventure(acc_adventure: Dict):
        return acc_adventure['total_points_for_questions_awarded'] * acc_adventure['applied_time_modifier'] / 100

    def points_for_adventure(self, adventure: Adventure):
        acc_adventure = next(
            acc_adventure for acc_adventure in self.acc_adventures if acc_adventure['adventure'] == adventure.id
        )
        return self.points_for_accomplished_adventure(acc_adventure)

    def points_for_adventure_percent(self, adventure: Adventure):
        return self.points_for_adventure(adventure) / adventure.max_points_possible * 100

    def points_for_chapter(self, chapter: Chapter):
        acc_adventures = self.adventures_by_chapters[chapter.id]
        return sum(self.points_for_accomplished_adventure(acc_adventure) for acc_adventure in acc_adventures)

    def points_for_chapter_percent(self, chapter: Chapter):
        return self.points_for_chapter(chapter) / chapter.max_points_possible * 100

    def points_for_plot_part(self, plot_part: PlotPart):
        acc_adventures = self.adventures_by_plot_parts[plot_part.id]
        return sum(self.points_for_accomplished_adventure(acc_adventure) for acc_adventure in acc_adventures)

    def points_for_plot_part_percent(self, plot_part: PlotPart):
        return self.points_for_plot_part(plot_part) / plot_part.max_points_possible * 100

    def points_for_all(self):
        return sum(self.points_for_accomplished_adventure(acc_adventure) for acc_adventure in self.acc_adventures)

    def max_points_for_all(self):
        return sum(
            chapter.max_points_possible for chapter in Chapter.objects.filter(id__in=self.adventures_by_chapters.keys())
        )

    @staticmethod
    def time_taken_in_accomplished_adventures(acc_adventures: List[Dict]):
        return sum(acc_adventure['time_elapsed_seconds'] for acc_adventure in acc_adventures
                   if acc_adventure['adventure__time_limit'] > 0)

    @staticmethod
    def total_time_limit_in_accomplished_adventures(acc_adventures: List[Dict]):
        return sum(acc_adventure['adventure__time_limit'] for acc_adventure in acc_adventures)

    def time_taken_in_accomplished_adventures_percent(self, acc_adventures: List[Dict]):
        time_taken = self.time_taken_in_accomplished_adventures(acc_adventures)
        total_time_limit = self.total_time_limit_in_accomplished_adventures(acc_adventures)
        return time_taken / total_time_limit * 100 if total_time_limit > 0 else 0

    def average_time_taken_in_chapter_percent(self, chapter: Chapter):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_chapters[chapter.id])

    def average_time_taken_in_plot_part_percent(self, plot_part: PlotPart):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_plot_parts[plot_part.id])
