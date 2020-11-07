from datetime import datetime
from typing import List, Tuple, Set, Union, Optional

from .achievements import check_for_achievements
from .grading import grade_answers, points_for_chapter, ScoreAggregator
from .models import Participant, Adventure, AccomplishedAdventure, Question, Answer, Grade, QuestionSummary, \
    AdventureSummary, Chapter, AccomplishedChapter, NextAdventureChoice


def start_chapter(participant: Participant, chapter: Chapter) -> Adventure:
    AccomplishedChapter.objects.create(chapter=chapter, student=participant)
    return chapter.initial_adventure


def process_answers(participant: Participant, adventure: Adventure, start_time: datetime, answer_time: int, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]], image_questions_answers: List[Tuple[Question, str]]):
    points_gained = grade_answers(participant, closed_question_answers, open_question_answers, image_questions_answers)
    AccomplishedAdventure.objects.create(student=participant, adventure=adventure, adventure_started_time=start_time,
                                         time_elapsed_seconds=answer_time,
                                         total_points_for_questions_awarded=points_gained,
                                         applied_time_modifier_percent=adventure.get_time_modifier(answer_time))
    next_stage = _get_next_stage(adventure)
    if not next_stage:
        current_chapter = adventure.chapter
        current_course_acc_adventures = AccomplishedAdventure.objects.filter(student=participant,
                                                                             adventure__chapter__plot_part__course=
                                                                             current_chapter.course)
        current_chapter_acc_adventures = current_course_acc_adventures.filter(adventure__chapter=current_chapter)
        acc_chapter = AccomplishedChapter.objects.get(chapter=current_chapter, student=participant)
        score_aggregator = ScoreAggregator(current_course_acc_adventures.values(
            'total_points_for_questions_awarded', 'applied_time_modifier_percent', 'adventure__max_points_possible',
            'adventure__chapter', 'adventure__chapter__plot_part', 'time_elapsed_seconds', 'adventure__time_limit',
        ))
        total_points = score_aggregator.points_for_chapter(current_chapter)
        acc_chapter.complete(total_points)
        summary = _get_summary(current_chapter_acc_adventures)
        if all([acc_adventure.adventure.is_auto_checked for acc_adventure in current_chapter_acc_adventures]):
            acc_chapter.start_recalculating()
            check_for_achievements(participant, current_chapter, acc_chapter, score_aggregator)
            acc_chapter.calculate_achievements()
            participant.update_score_in_course(current_chapter.course, score_aggregator.points_for_all(), score_aggregator.max_points_for_all())
            acc_chapter.recalculate_total_score()
    return next_stage or summary


def _get_next_stage(adventure: Adventure) -> Optional[Union[NextAdventureChoice, Adventure]]:
    next_adventures = adventure.next_adventures
    next_adventures_count = len(next_adventures)
    if next_adventures_count == 0:
        return None
    elif next_adventures_count == 1:
        return next_adventures[0]
    else:
        return NextAdventureChoice.for_adventure(adventure)


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


def is_adventure(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, Adventure)


def is_choice(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, NextAdventureChoice)


def is_summary(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return not is_adventure(adventure_stage) and not is_choice(adventure_stage)
