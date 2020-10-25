from typing import Optional, Set, List, Tuple

from .models import Participant, Adventure, AccomplishedAdventure, Chapter, PlotPart, Course, Question, \
    Grade, Answer


def points_for_adventure(student: Participant, adventure: Optional[Adventure] = None, acc_adventure: Optional[AccomplishedAdventure] = None):
    acc_adventure = acc_adventure or AccomplishedAdventure.objects.get(adventure=adventure, student=student)
    return acc_adventure.points_after_applying_modifier


def points_for_chapter(student: Participant, chapter: Optional[Chapter] = None, acc_adventures: Optional[Set[AccomplishedAdventure]] = None):
    acc_adventures = acc_adventures or AccomplishedAdventure.objects.filter(adventure__in=chapter.adventures, student=student)
    return sum([points_for_adventure(student, acc_adventure=acc_adventure) for acc_adventure in acc_adventures])


def points_for_plot_part(student: Participant, plot_part: Optional[PlotPart] = None, acc_adventures: Optional[Set[AccomplishedAdventure]] = None):
    acc_adventures = acc_adventures or AccomplishedAdventure.objects.filter(adventure__chapter__in=plot_part.chapters, student=student)
    return sum([points_for_adventure(student, acc_adventure=acc_adventure) for acc_adventure in acc_adventures])


def points_for_course(student: Participant, course: Course):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__plot_part__in=course.plot_parts, student=student)
    return sum([points_for_adventure(student, acc_adventure=acc_adventure) for acc_adventure in acc_adventures])


def time_taken_in_chapter_in_time_bound_adventures(student: Participant, chapter: Optional[Chapter] = None, acc_adventures: Optional[Set[AccomplishedAdventure]] = None):
    acc_adventures = acc_adventures or AccomplishedAdventure.objects.filter(adventure__chapter=chapter, student=student)
    return sum([acc_adventure.time_elapsed_seconds for acc_adventure in acc_adventures if acc_adventure.adventure.has_time_limit])


def time_taken_in_plot_part_in_time_bound_adventures(student: Participant, plot_part: Optional[PlotPart] = None, acc_adventures: Optional[Set[AccomplishedAdventure]] = None):
    acc_adventures = acc_adventures or AccomplishedAdventure.objects.filter(adventure__chapter__in=plot_part.chapters, student=student)
    return sum([acc_adventure.time_elapsed_seconds for acc_adventure in acc_adventures if acc_adventure.adventure.has_time_limit])


def average_time_taken_in_chapter_percent(student: Participant, chapter: Chapter, acc_adventures: Set[AccomplishedAdventure]):
    return time_taken_in_chapter_in_time_bound_adventures(student, acc_adventures=acc_adventures) / chapter.total_time_limit * 100


def average_time_taken_in_plot_part_percent(student: Participant, plot_part: PlotPart, acc_adventures: Set[AccomplishedAdventure]):
    return time_taken_in_plot_part_in_time_bound_adventures(student, acc_adventures=acc_adventures) / plot_part.total_time_limit * 100


def grade_answers(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]) -> float:
    sum_of_points = 0.0
    for question_answer_type in (closed_question_answers, open_question_answers):
        for question_answer in question_answer_type:
            question = question_answer[0]
            given_answer = question_answer[1]
            if not question.is_auto_checked:
                Grade.objects.create(student=participant, question=question, points_scored=0,
                                     awaiting_tutor_grading=True)
            else:
                if question_answer in closed_question_answers:
                    question_points_scored = question.score_for_closed_question(given_answer)
                else:
                    question_points_scored = question.score_for_open_question(given_answer)
                Grade.objects.create(student=participant, question=question, points_scored=question_points_scored)
                sum_of_points += question_points_scored
    return sum_of_points
