from datetime import datetime
from typing import List, Tuple, Set, Union, Optional
from statistics import mean

from .achievements import check_for_achievements
from .models import Participant, Adventure, AccomplishedAdventure, Question, Answer, Grade, QuestionSummary, \
    AdventureSummary, Chapter, AccomplishedChapter, NextAdventureChoice


def start_chapter(participant: Participant, chapter: Chapter) -> Adventure:
    AccomplishedChapter.objects.create(chapter=chapter, student=participant)
    return chapter.initial_adventure


def process_answers(participant: Participant, adventure: Adventure, start_time: datetime, answer_time: int, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]):
    AccomplishedAdventure.objects.create(student=participant, adventure=adventure,
                                         adventure_started_time=start_time, time_elapsed_seconds=answer_time)
    _grade_answers(participant, closed_question_answers, open_question_answers)
    next_stage = _get_next_stage(adventure)
    if not next_stage:
        current_chapter = adventure.chapter
        accomplished_adventures = AccomplishedAdventure.objects.filter(student=participant,
                                                                       adventure__chapter=current_chapter)
        total_points, average_time_taken_percent = _get_player_stats_from_chapter(accomplished_adventures)
        AccomplishedChapter.objects.get(chapter=current_chapter,
                                        student=participant).complete(total_points, average_time_taken_percent)
        summary = _get_summary(accomplished_adventures)
        check_for_achievements(participant, current_chapter)
        # TODO update rank
    return next_stage or summary


def _grade_answers(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]) -> None:
    for question_answer_type in (closed_question_answers, open_question_answers):
        for question_answer in question_answer_type:
            question = question_answer[0]
            given_answer = question_answer[1]
            if not question.is_auto_checked:
                Grade.objects.create(student=participant, question=question, points_scored=0,
                                     awaiting_tutor_grading=True)
            else:
                if question_answer in closed_question_answers:
                    points_scored = question.score_for_closed_question(given_answer)
                else:
                    points_scored = question.score_for_open_question(given_answer)
                Grade.objects.create(student=participant, question=question, points_scored=points_scored)


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


def _get_player_stats_from_chapter(accomplished_adventures: Set[AccomplishedAdventure]):
    total_points = sum([aa.points_after_applying_modifier for aa in accomplished_adventures])
    average_time_used_percent = int(mean([aa.time_elapsed_seconds / aa.adventure.time_limit for aa
                                          in accomplished_adventures if aa.adventure.time_limit > 0]))
    return total_points, average_time_used_percent


def is_adventure(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, Adventure)


def is_choice(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return isinstance(adventure_stage, NextAdventureChoice)


def is_summary(adventure_stage: Optional[Union[NextAdventureChoice, Adventure]]) -> bool:
    return not is_adventure(adventure_stage) and not is_choice(adventure_stage)
