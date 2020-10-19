from typing import Set, List

from golfplatz.models import Participant, Achievement, Chapter, AccomplishedChapter, AccomplishedAchievement


async def check_for_achievements(participant: Participant, after_chapter: Chapter):
    accomplish_count = 0
    not_collected_achievements = Achievement.objects.filter(course=after_chapter.course).exclude(accomplished_by_students=participant)
    for achievement in not_collected_achievements:
        if check_player_gained(participant, achievement, after_chapter):
            AccomplishedAchievement.objects.create(achievement=achievement, student=participant)
            accomplish_count += 1
    current_acc_chapter = AccomplishedChapter.objects.get(student=participant, chapter=after_chapter)
    current_acc_chapter.new_achievements_count = accomplish_count
    current_acc_chapter.save()


def check_player_gained(participant: Participant, achievement: Achievement, after_chapter: Chapter):
    accomplished_chapters = AccomplishedChapter.objects.filter(student=participant)
    if achievement.course_element_considered == Achievement.CourseElementChoice.PLOT_PART:
        if not after_chapter.is_last_in_plot_part:
            return False
        return _check_for_plot_part_achievement(accomplished_chapters, achievement)
    elif achievement.course_element_considered == Achievement.CourseElementChoice.CHAPTER:
        return _check_for_chapter_achievement(accomplished_chapters, achievement)


def _check_for_chapter_achievement(acc_chapters: Set[AccomplishedChapter], achievement: Achievement):
    if len(acc_chapters) < achievement.how_many:
        return False
    counter = 0
    for acc_chapter in acc_chapters:
        if _check_chapter_meets_condition(acc_chapter, achievement):
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_for_plot_part_achievement(acc_chapters: Set[AccomplishedChapter], achievement: Achievement):
    plot_part_to_acc_chapter = {}
    for acc_chapter in acc_chapters:
        plot_part = acc_chapter.chapter.plot_part
        plot_part_to_acc_chapter[plot_part] = plot_part_to_acc_chapter.get(plot_part, []).append(acc_chapter)
    if len(plot_part_to_acc_chapter) < achievement.how_many:
        return False
    counter = 0
    for acc_plot_part in list(plot_part_to_acc_chapter.values()):
        if _check_plot_part_meets_condition(acc_plot_part, achievement):
            counter += 1
        elif achievement.in_a_row:
            counter = 0
    return counter >= achievement.how_many


def _check_chapter_meets_condition(acc_chapter: AccomplishedChapter, achievement: Achievement):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        return acc_chapter.points_scored / acc_chapter.chapter.max_points_possible * 100 >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        return acc_chapter.average_time_taken_percent <= achievement.percentage


def _check_plot_part_meets_condition(acc_plot_part: List[AccomplishedChapter], achievement: Achievement):
    if achievement.condition_type == Achievement.ConditionType.SCORE:
        max_points = sum([acc_chapter.chapter.max_points_possible for acc_chapter in acc_plot_part])
        points_scored = sum([acc_chapter.points_scored for acc_chapter in acc_plot_part])
        return points_scored / max_points * 100 >= achievement.percentage
    elif achievement.condition_type == Achievement.ConditionType.TIME:
        average_time_taken = [acc_chapter.average_time_taken_percent for acc_chapter in acc_plot_part]
        time_restricted_adventures_count = [acc_chapter.chapter.timed_adventures_count for acc_chapter in acc_plot_part]
        if sum(time_restricted_adventures_count) > 0:
            return _weighted_average(average_time_taken, time_restricted_adventures_count) <= achievement.percentage
        else:
            return False


def _weighted_average(numbers, weights):
    return sum(number * weight for number, weight in zip(numbers, weights)) / sum(weights)
