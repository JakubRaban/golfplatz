from collections import defaultdict
from datetime import datetime
from typing import List, Tuple, Set, Union, Optional, Dict

from django.db import transaction

from .achievements import check_for_achievements
from .chapters import get_accomplished_adventures_for_student
from .models import Participant, Adventure, AccomplishedAdventure, Question, Answer, Grade, QuestionSummary, \
    AdventureSummary, Chapter, AccomplishedChapter, NextAdventureChoice, StudentImageAnswer, StudentTextAnswer
from .scoring import ScoreAggregator


def start_chapter(participant: Participant, chapter: Chapter) -> Adventure:
    AccomplishedChapter.objects.create(chapter=chapter, student=participant)
    return chapter.initial_adventure


def process_answers(participant: Participant, adventure: Adventure, start_time: datetime, answer_time: int, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]], image_questions_answers: List[Tuple[Question, str]]):
    points_gained = grade_answers_automatically(participant, closed_question_answers, open_question_answers, image_questions_answers)
    AccomplishedAdventure.objects.create(student=participant, adventure=adventure, adventure_started_time=start_time,
                                         time_elapsed_seconds=answer_time,
                                         total_points_for_questions_awarded=points_gained,
                                         applied_time_modifier_percent=adventure.get_time_modifier(answer_time),
                                         is_fully_graded=adventure.is_auto_checked)
    next_stage = _get_next_stage(adventure)
    if not next_stage:
        summary = do_post_chapter_operations(adventure, student=participant)
    return next_stage or summary


def do_post_chapter_operations(adventure: Adventure, student: Participant, calculate_summary: bool = True):
    current_chapter = adventure.chapter
    current_chapter_acc_adventures = AccomplishedAdventure.objects.filter(student=student,
                                                                          adventure__chapter=current_chapter)
    # Thread(target=calculate_score_and_achievements,
    #        args=(current_chapter_acc_adventures, current_course_acc_adventures, current_chapter, student)
    #        ).start()
    calculate_score_and_achievements(current_chapter_acc_adventures, current_chapter, student)
    if calculate_summary:
        return _get_summary(current_chapter_acc_adventures)


def calculate_score_and_achievements(current_chapter_acc_adventures: Set[AccomplishedAdventure], current_chapter: Chapter, student: Participant):
    if all(acc_adventure.is_fully_graded for acc_adventure in current_chapter_acc_adventures):
        acc_chapter = AccomplishedChapter.objects.get(chapter=current_chapter, student=student)
        acc_chapter.complete()
        score_aggregator = ScoreAggregator(get_accomplished_adventures_for_student(student, current_chapter.course).values(
            'total_points_for_questions_awarded', 'applied_time_modifier_percent', 'adventure__max_points_possible',
            'adventure__chapter', 'adventure__chapter__plot_part', 'time_elapsed_seconds', 'adventure__time_limit',
        ))
        total_points = score_aggregator.points_for_chapter(current_chapter)
        acc_chapter.save_points_scored(total_points)
        acc_chapter.mark_recalculating_started()
        check_for_achievements(student, current_chapter, acc_chapter, score_aggregator)
        acc_chapter.mark_achievements_calculated()
        student.update_score_in_course(current_chapter.course, score_aggregator.points_for_all(),
                                       score_aggregator.max_points_for_all())
        acc_chapter.mark_total_score_recalculated()


def _get_next_stage(adventure: Adventure) -> Optional[Union[NextAdventureChoice, Adventure]]:
    next_adventures = adventure.next_adventures
    next_adventures_count = len(next_adventures)
    if next_adventures_count == 0:
        return None
    elif next_adventures_count == 1:
        return next_adventures[0]
    else:
        next_adventure_choice = NextAdventureChoice.for_adventure(adventure)
        if not next_adventure_choice:
            raise ValueError(f"Could not retrieve NextAdventureChoice for adventure {adventure}")
        return next_adventure_choice


def _get_summary(accomplished_adventures: Set[AccomplishedAdventure]) -> List[AdventureSummary]:
    adventure_summaries = []
    for accomplished_adventure in accomplished_adventures:
        adventure = accomplished_adventure.adventure
        answer_time = accomplished_adventure.time_elapsed_seconds
        questions = adventure.point_source.questions.all()
        question_summaries = [QuestionSummary(text=question.text,
                                              is_auto_checked=question.is_auto_checked,
                                              max_points=question.max_points_possible,
                                              points_scored=Grade.objects.get(question=question,
                                                                              student=accomplished_adventure.student)
                                              .points_scored)
                              for question in questions]
        adventure_summaries.append(AdventureSummary(
            adventure_name=adventure.name,
            answer_time=answer_time,
            time_modifier=adventure.get_time_modifier(answer_time),
            question_summaries=question_summaries
        ))
    return adventure_summaries


def grade_answers_automatically(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]],
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
                    StudentImageAnswer.objects.create(grade=new_grade, image=given_answer)
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


def grade_answers_manually(adventure: Adventure, points_scored: Dict[Grade, float]):
    student_to_grades = defaultdict(lambda: [])
    with transaction.atomic():
        for grade, points in points_scored.items():
            student_to_grades[grade.student].append(grade)
            grade.grade_manually(points)
        students = student_to_grades.keys()
        acc_adventures = AccomplishedAdventure.objects.filter(adventure=adventure, student__in=students)
        for acc_adventure in acc_adventures:
            current_points = acc_adventure.total_points_for_questions_awarded
            acc_adventure.total_points_for_questions_awarded = current_points + sum(grade.points_scored for grade in student_to_grades[acc_adventure.student])
            acc_adventure.is_fully_graded = True
            acc_adventure.save()
    for student in students:
        do_post_chapter_operations(adventure, student, calculate_summary=False)


def is_adventure(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, Adventure)


def is_choice(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, NextAdventureChoice)


def is_summary(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return not is_adventure(adventure_stage) and not is_choice(adventure_stage)
