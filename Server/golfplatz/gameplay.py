from datetime import datetime
from typing import List, Tuple, Set

from .models import Participant, Adventure, Question, Answer, Grade


def grade_answers_and_get_next_adventure(participant: Participant, adventure: Adventure, start_time: datetime, answer_time: int, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]) -> List[Adventure]:
    # TODO wpis do PathCoverage
    _answer_questions(participant, closed_question_answers, open_question_answers)
    return adventure.next_adventures()


def _answer_questions(participant: Participant, closed_question_answers: List[Tuple[Question, Set[Answer]]], open_question_answers: List[Tuple[Question, str]]):
    for closed_answer in closed_question_answers:
        question = closed_answer[0]
        given_answers = closed_answer[1]
        points_scored = question.score_for_closed_question(given_answers)
        Grade.objects.create(student=participant, question=question, points_scored=points_scored)
    for open_answer in open_question_answers:
        question = open_answer[0]
        given_answer = open_answer[1]
        points_scored = question.score_for_open_question(given_answer)
        Grade.objects.create(student=participant, question=question, points_scored=points_scored)
