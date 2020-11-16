from itertools import chain
from typing import List, Dict

from golfplatz.models import Chapter, PlotPart, Course, Participant, AccomplishedChapter, AccomplishedAdventure


def get_plot_part_to_chapters_dict(course: Course) -> Dict[PlotPart, List[Chapter]]:
    return {plot_part: list(plot_part.chapters.all()) for plot_part in PlotPart.objects.filter(course=course)}


def get_plot_part_to_done_chapters_dict_for_student(student: Participant, course: Course) -> Dict[PlotPart, List[Chapter]]:
    result = {}
    for plot_part, chapters in get_plot_part_to_chapters_dict(course):
        done_chapters = [acc_chapter.chapter for acc_chapter in AccomplishedChapter.objects.filter(chapter__in=chapters, student=student, is_completed=True)]
        result[plot_part] = done_chapters
    return result


def get_done_chapters_for_student(student: Participant, course: Course) -> List[Chapter]:
    return list(chain(*get_plot_part_to_done_chapters_dict_for_student(student, course).values()))


def get_accomplished_adventures_for_student(student: Participant, course: Course):
    return AccomplishedAdventure.objects.filter(adventure__chapter__in=get_done_chapters_for_student(student, course),
                                                student=student)
