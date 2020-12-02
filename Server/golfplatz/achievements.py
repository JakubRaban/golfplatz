from itertools import chain
from typing import List, Dict

from golfplatz.chapters import get_plot_part_to_done_chapters_dict_for_student
from golfplatz.scoring import ScoreAggregator
from golfplatz.models import Participant, Achievement, Chapter, AccomplishedChapter, AccomplishedAchievement, \
    PlotPart


def check_for_achievements(student: Participant, last_chapter: Chapter, acc_chapter: AccomplishedChapter, score_aggregator: ScoreAggregator):
    not_collected_achievements = Achievement.objects.filter(course=last_chapter.course).exclude(accomplished_by_students=student)
    for achievement in not_collected_achievements:
        if _check_for_achievement(achievement, last_chapter, score_aggregator, student):
            AccomplishedAchievement.objects.create(achievement=achievement, student=student,
                                                   accomplished_in_chapter=acc_chapter)


def _check_for_achievement(achievement: Achievement, last_chapter: Chapter, score_aggregator: ScoreAggregator, student: Participant):
    previous_chapters = get_plot_part_to_done_chapters_dict_for_student(student, last_chapter.course)
    if achievement.course_element_considered == Achievement.CourseElementChoice.PLOT_PART:
        if not last_chapter.is_last_in_plot_part:
            return False
        return _check_for_plot_part_achievement(previous_chapters, achievement, score_aggregator)
    elif achievement.course_element_considered == Achievement.CourseElementChoice.CHAPTER:
        return _check_for_chapter_achievement(previous_chapters, achievement, score_aggregator)


def _check_for_chapter_achievement(previous_chapters: Dict[PlotPart, List[Chapter]], achievement: Achievement, score_aggregator: ScoreAggregator):
    chapters = list(chain(*previous_chapters.values()))
    if len(chapters) < achievement.how_many:
        return False
    counter = 0
    for chapter in chapters:
        condition_check = _check_chapter_meets_condition(chapter, achievement, score_aggregator)
        if condition_check is None:
            pass
        elif condition_check:
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_for_plot_part_achievement(previous_chapters: Dict[PlotPart, List[Chapter]], achievement: Achievement, score_aggregator: ScoreAggregator):
    plot_parts = list(previous_chapters.keys())
    fully_done_plot_parts = [plot_part for plot_part in plot_parts
                             if len(previous_chapters[plot_part]) == len(plot_part.chapters.all())
                             ]
    if len(fully_done_plot_parts) < achievement.how_many:
        return False
    counter = 0
    for plot_part in fully_done_plot_parts:
        condition_check = _check_plot_part_meets_condition(plot_part, achievement, score_aggregator)
        if condition_check is None:
            pass
        if condition_check:
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_chapter_meets_condition(chapter: Chapter, achievement: Achievement, score_aggregator: ScoreAggregator):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        points = score_aggregator.points_for_chapter_percent(chapter, achievement.adventure_category_included)
        return points and points >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        time_taken = score_aggregator.average_time_taken_in_chapter_percent(chapter, achievement.adventure_category_included)
        return time_taken and time_taken <= achievement.percentage


def _check_plot_part_meets_condition(plot_part: PlotPart, achievement: Achievement, score_aggregator: ScoreAggregator):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        points = score_aggregator.points_for_plot_part_percent(plot_part, achievement.adventure_category_included)
        return points and points >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        time_taken = score_aggregator.average_time_taken_in_plot_part_percent(plot_part, achievement.adventure_category_included)
        return time_taken and time_taken <= achievement.percentage
