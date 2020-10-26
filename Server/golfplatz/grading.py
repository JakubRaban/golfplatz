from typing import Set, List, Tuple

from .models import Participant, Adventure, AccomplishedAdventure, Chapter, PlotPart, Course, Question, \
    Grade, Answer


def points_for_accomplished_adventures(acc_adventures: Set[AccomplishedAdventure]):
    return sum([acc_adventure.points_after_applying_modifier for acc_adventure in acc_adventures])


def points_for_adventure(student: Participant, adventure: Adventure):
    acc_adventure = AccomplishedAdventure.objects.filter(adventure=adventure, student=student)
    return points_for_accomplished_adventures(acc_adventure)


def points_for_chapter(student: Participant, chapter: Chapter):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__in=chapter.adventures.all(), student=student)
    return points_for_accomplished_adventures(acc_adventures)


def points_for_plot_part(student: Participant, plot_part: PlotPart):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__in=plot_part.chapters.all(), student=student)
    return points_for_accomplished_adventures(acc_adventures)


def points_for_course(student: Participant, course: Course):
    acc_adventures = AccomplishedAdventure.objects.filter(adventure__chapter__plot_part__in=course.plot_parts.all(), student=student)
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
    return sum([acc_adventure.time_elapsed_seconds for acc_adventure in acc_adventures if acc_adventure.adventure.has_time_limit])


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
                sum_of_points += float(question_points_scored)
    return sum_of_points
