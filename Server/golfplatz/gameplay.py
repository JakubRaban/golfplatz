from datetime import datetime
from typing import List, Tuple, Set

from .models import Participant, Adventure, AccomplishedAdventure, Question, Answer, Grade, QuestionSummary, \
    AdventureSummary


def grade_answers_and_get_next_adventure(participant: Participant, adventure: Adventure, start_time: datetime, answer_time: int, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]) -> List[Adventure]:
    AccomplishedAdventure.objects.create(student=participant, adventure=adventure,
                                         adventure_started_time=start_time, time_elapsed_seconds=answer_time)
    _grade_answers(participant, closed_question_answers, open_question_answers, answer_time)
    return adventure.next_adventures
        

def _grade_answers(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]], answer_time: int):
    for question_answer_type in (closed_question_answers, open_question_answers):
        for question_answer in question_answer_type:
            question = question_answer[0]
            given_answer = question_answer[1]
            if not question.point_source.is_auto_checked:
                Grade.objects.create(student=participant, question=question, points_scored=0, awaiting_tutor_grading=True)
            else:
                if question_answer in closed_question_answers:
                    points_scored = question.score_for_closed_question(given_answer)
                else:
                    points_scored = question.score_for_open_question(given_answer)
                Grade.objects.create(student=participant, question=question, points_scored=points_scored)


def get_summary(participant: Participant, last_adventure: Adventure):
    accomplished_adventures = AccomplishedAdventure.objects.filter(student=participant, adventure__chapter=last_adventure.chapter)\
        .order_by('adventure_started_time')
    adventure_summaries = []
    for accomplished_adventure in accomplished_adventures:
        adventure = accomplished_adventure.adventure
        answer_time = accomplished_adventure.time_elapsed_seconds
        questions = adventure.point_source.questions.all()
        question_summaries = [QuestionSummary(text=question.text,
                                              max_points=question.max_points_possible,
                                              points_scored=Grade.objects.get(question=question, student=participant).points_scored)
                              for question in questions]
        adventure_summaries.append(AdventureSummary(
            adventure_name=adventure.name,
            answer_time=answer_time,
            time_modifier=adventure.get_time_modifier(answer_time),
            question_summaries=question_summaries
        ))
    return adventure_summaries
