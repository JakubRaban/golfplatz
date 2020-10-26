from itertools import chain
from typing import List, Dict

from golfplatz.grading import points_for_chapter_percent, average_time_taken_in_chapter_percent, \
    points_for_plot_part_percent, average_time_taken_in_plot_part_percent
from golfplatz.models import Participant, Achievement, Chapter, AccomplishedChapter, AccomplishedAchievement, \
    PlotPart


def check_for_achievements(student: Participant, previous_chapters: Dict[PlotPart, List[Chapter]]):
    last_chapter = list(previous_chapters.items())[-1][1][-1]
    not_collected_achievements = Achievement.objects.filter(course=last_chapter.course).exclude(accomplished_by_students=student)
    current_acc_chapter = AccomplishedChapter.objects.get(student=student, chapter=last_chapter)
    for achievement in not_collected_achievements:
        if check_player_gained(student, achievement, last_chapter, previous_chapters):
            AccomplishedAchievement.objects.create(achievement=achievement, student=student,
                                                   accomplished_in_chapter=current_acc_chapter)
    current_acc_chapter.calculate_achievements()


def check_player_gained(student: Participant, achievement: Achievement, after_chapter: Chapter, previous_chapters: Dict[PlotPart, List[Chapter]]):
    if achievement.course_element_considered == Achievement.CourseElementChoice.PLOT_PART:
        if not after_chapter.is_last_in_plot_part:
            return False
        return _check_for_plot_part_achievement(previous_chapters, achievement, student)
    elif achievement.course_element_considered == Achievement.CourseElementChoice.CHAPTER:
        return _check_for_chapter_achievement(previous_chapters, achievement, student)


def _check_for_chapter_achievement(previous_chapters: Dict[PlotPart, List[Chapter]], achievement: Achievement, student: Participant):
    chapters = list(chain(*previous_chapters.values()))
    if len(chapters) < achievement.how_many:
        return False
    counter = 0
    for chapter in chapters:
        if _check_chapter_meets_condition(chapter, achievement, student):
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_for_plot_part_achievement(previous_chapters: Dict[PlotPart, List[Chapter]], achievement: Achievement, student: Participant):
    plot_parts = list(previous_chapters.keys())
    if len(plot_parts) < achievement.how_many:
        return False
    counter = 0
    for plot_part in plot_parts:
        if _check_plot_part_meets_condition(plot_part, achievement, student):
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_chapter_meets_condition(chapter: Chapter, achievement: Achievement, student: Participant):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        return points_for_chapter_percent(student, chapter) >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        return 0 < average_time_taken_in_chapter_percent(student, chapter) <= achievement.percentage


def _check_plot_part_meets_condition(plot_part: PlotPart, achievement: Achievement, student: Participant):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        return points_for_plot_part_percent(student, plot_part) >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        return 0 < average_time_taken_in_plot_part_percent(student, plot_part) <= achievement.percentage
