from golfplatz.models import Chapter, Path, Adventure
import networkx as nx


class ChapterGraphVerifier:
    def __init__(self, chapter: Chapter):
        self.initial_adventure: Adventure = chapter.initial_adventure
        self.adventure_graph: nx.DiGraph = nx.DiGraph()
        self.adventure_graph.add_nodes_from(chapter.adventures.all())
        self.adventure_graph.add_edges_from([
            (path.adventure_from, path.adventure_to) for path in Path.objects.filter(from_adventure__chapter=chapter)
        ])

    def verify(self):
        return all([
            self._has_no_cycles(),
            self._initial_adventure_has_no_parent(),
            self._all_adventures_reachable()
        ])

    def _has_no_cycles(self):
        try:
            nx.find_cycle(self.adventure_graph, source=self.initial_adventure, orientation='original')
        except nx.NetworkXNoCycle:
            return True
        else:
            return False

    def _initial_adventure_has_no_parent(self):
        return len(list(self.adventure_graph.predecessors(self.initial_adventure))) == 0

    def _all_adventures_reachable(self):
        return len(nx.descendants(self.adventure_graph, self.initial_adventure)) == len(self.adventure_graph.nodes) - 1
