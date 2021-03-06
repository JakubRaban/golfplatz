from collections import defaultdict
from statistics import mean
from typing import List, Dict, Set, Optional

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
        return float(sum(self._get_weight(acc_adventure) for acc_adventure in acc_adventures))

    def points_for_accomplished_adventure(self, acc_adventure: Dict):
        return float(acc_adventure['total_points_for_questions_awarded']
                     * self._get_weight(acc_adventure)
                     * acc_adventure['applied_time_modifier_percent'] / 100)

    def points_for_adventure(self, adventure: Adventure):
        acc_adventure = self._get_accomplished_adventure_by_adventure(adventure)
        return float(self.points_for_accomplished_adventure(acc_adventure))

    def points_for_adventure_percent(self, adventure: Adventure):
        acc_adventure = self._get_accomplished_adventure_by_adventure(adventure)
        return float(self.points_for_adventure(adventure) / (adventure.max_points_possible * self._get_weight(acc_adventure))
                     * 100)

    def points_for_chapter(self, chapter: Chapter, category: Optional[str] = None):
        acc_adventures = [acc_adventure for acc_adventure in self.adventures_by_chapters[chapter.id]
                          if not category or acc_adventure['adventure__point_source__category'] == category]
        if acc_adventures:
            points = [self.points_for_accomplished_adventure(acc_adventure) for acc_adventure in acc_adventures]
            weights = [self._get_weight(acc_adventure) for acc_adventure in acc_adventures]
            return float(sum(points)) / float(mean(weights))
        return None

    def max_points_for_chapter(self, chapter: Chapter, category: Optional[str] = None):
        if not category:
            return chapter.max_points_possible
        acc_adventures = [acc_adventure for acc_adventure in self.adventures_by_chapters[chapter.id]
                          if not category or acc_adventure['adventure__point_source__category'] == category]
        return float(sum(acc_adventure['adventure__max_points_possible'] for acc_adventure in acc_adventures))

    def points_for_chapter_percent(self, chapter: Chapter, category: Optional[str] = None):
        points_for_chapter = self.points_for_chapter(chapter, category)
        max_points_for_chapter = self.max_points_for_chapter(chapter, category)
        return float(points_for_chapter / max_points_for_chapter * 100) if points_for_chapter else None

    def points_for_plot_part(self, plot_part: PlotPart, category: Optional[str] = None):
        points_for_chapters = [self.points_for_chapter(chapter, category) for chapter in plot_part.chapters.all()]
        points_for_chapters = [p for p in points_for_chapters if p is not None]
        if points_for_chapters:
            return float(sum(points_for_chapters))
        return None

    def max_points_for_plot_part(self, plot_part: PlotPart, category: Optional[str] = None):
        if not category:
            return plot_part.max_points_possible
        max_points_for_chapters = [self.max_points_for_chapter(chapter, category) for chapter in plot_part.chapters.all()]
        max_points_for_chapters = [p for p in max_points_for_chapters if p is not None]
        if max_points_for_chapters:
            return float(sum(max_points_for_chapters))
        return None

    def points_for_plot_part_percent(self, plot_part: PlotPart, category: Optional[str] = None):
        points_for_plot_part = float(self.points_for_plot_part(plot_part, category))
        max_points_for_plot_part = float(self.max_points_for_plot_part(plot_part, category))
        return points_for_plot_part / max_points_for_plot_part * 100 if points_for_plot_part else None

    @staticmethod
    def time_taken_in_accomplished_adventures(acc_adventures: List[Dict], category: Optional[str] = None):
        return float(sum(acc_adventure['time_elapsed_seconds'] for acc_adventure in acc_adventures
                     if acc_adventure['adventure__time_limit'] > 0 and
                     (not category or acc_adventure['adventure__point_source__category'] == category)))

    @staticmethod
    def total_time_limit_in_accomplished_adventures(acc_adventures: List[Dict], category: Optional[str] = None):
        return float(sum(acc_adventure['adventure__time_limit'] for acc_adventure in acc_adventures
                     if not category or acc_adventure['adventure__point_source__category'] == category))

    def time_taken_in_accomplished_adventures_percent(self, acc_adventures: List[Dict], category: Optional[str] = None):
        time_taken = float(self.time_taken_in_accomplished_adventures(acc_adventures, category))
        total_time_limit = float(self.total_time_limit_in_accomplished_adventures(acc_adventures, category))
        return time_taken / total_time_limit * 100 if total_time_limit > 0 else None

    def average_time_taken_in_chapter_percent(self, chapter: Chapter, category: Optional[str] = None):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_chapters[chapter.id], category)

    def average_time_taken_in_plot_part_percent(self, plot_part: PlotPart, category: Optional[str] = None):
        return self.time_taken_in_accomplished_adventures_percent(self.adventures_by_plot_parts[plot_part.id], category)
