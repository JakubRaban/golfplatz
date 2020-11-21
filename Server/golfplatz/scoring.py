from collections import defaultdict
from statistics import mean
from typing import List, Dict, Set

from .models import Adventure, Chapter, PlotPart, Weight


class ScoreAggregator:
    def __init__(self, acc_adventures: List[Dict], weights: Set[Weight]):
        self.acc_adventures = acc_adventures
        self.adventures_by_plot_parts = defaultdict(lambda: [])
        self.adventures_by_chapters = defaultdict(lambda: [])
        for acc_adventure in acc_adventures:
            plot_part = acc_adventure['adventure__chapter__plot_part']
            chapter = acc_adventure['adventure__chapter']
            self.adventures_by_plot_parts[plot_part].append(acc_adventure)
            self.adventures_by_chapters[chapter].append(acc_adventure)
        self.weights = {weight.category: weight.weight for weight in weights}

    @property
    def chapters(self):
        return self.adventures_by_chapters.keys()

    def _get_weight(self, acc_adventure: Dict):
        return self.weights[acc_adventure['adventure__point_source__category']]

    def _get_accomplished_adventure_by_adventure(self, adventure: Adventure):
        return next(
            acc_adventure for acc_adventure in self.acc_adventures if acc_adventure['adventure'] == adventure.id
        )

    def _sum_of_weights_in_acc_adventures(self, acc_adventures: List[Dict]):
        return sum(self._get_weight(acc_adventure) for acc_adventure in acc_adventures)

    def points_for_accomplished_adventure(self, acc_adventure: Dict):
        return acc_adventure['total_points_for_questions_awarded'] \
               * self._get_weight(acc_adventure) \
               * acc_adventure['applied_time_modifier_percent'] / 100

    def points_for_adventure(self, adventure: Adventure):
        acc_adventure = self._get_accomplished_adventure_by_adventure(adventure)
        return self.points_for_accomplished_adventure(acc_adventure)

    def points_for_adventure_percent(self, adventure: Adventure):
        acc_adventure = self._get_accomplished_adventure_by_adventure(adventure)
        return self.points_for_adventure(adventure) / (adventure.max_points_possible * self._get_weight(acc_adventure))\
            * 100

    def points_for_chapter(self, chapter: Chapter):
        acc_adventures = self.adventures_by_chapters[chapter.id]
        points = [self.points_for_accomplished_adventure(acc_adventure) for acc_adventure in acc_adventures]
        weights = [self._get_weight(acc_adventure) for acc_adventure in acc_adventures]
        return sum(point * weight for point, weight in zip(points, weights)) / mean(weights)

    def points_for_chapter_percent(self, chapter: Chapter):
        return self.points_for_chapter(chapter) / chapter.max_points_possible * 100

    def points_for_plot_part(self, plot_part: PlotPart):
        return sum(self.points_for_chapter(chapter) for chapter in plot_part.chapters.all())

    def points_for_plot_part_percent(self, plot_part: PlotPart):
        return self.points_for_plot_part(plot_part) / plot_part.max_points_possible * 100

    def points_for_all(self):
        return sum(self.points_for_chapter(chapter) for chapter in Chapter.objects.filter(id__in=self.chapters))

    def max_points_for_all(self):
        return sum(chapter.max_points_possible for chapter in Chapter.objects.filter(id__in=self.chapters))

    @staticmethod
    def time_taken_in_accomplished_adventures(acc_adventures: List[Dict]):
        return sum(acc_adventure['time_elapsed_seconds'] for acc_adventure in acc_adventures
                   if acc_adventure['adventure__time_limit'] > 0)

    @staticmethod
    def total_time_limit_in_accomplished_adventures(acc_adventures: List[Dict]):
        return sum(acc_adventure['adventure__time_limit'] for acc_adventure in acc_adventures)

    def time_taken_in_accomplished_adventures_percent(self, acc_adventures: List[Dict]):
        time_taken = self.time_taken_in_accomplished_adventures(acc_adventures)
        total_time_limit = self.total_time_limit_in_accomplished_adventures(acc_adventures)
        return time_taken / total_time_limit * 100 if total_time_limit > 0 else 0

    def average_time_taken_in_chapter_percent(self, chapter: Chapter):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_chapters[chapter.id])

    def average_time_taken_in_plot_part_percent(self, plot_part: PlotPart):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_plot_parts[plot_part.id])
