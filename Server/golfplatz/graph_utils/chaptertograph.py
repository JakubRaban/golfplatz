
import networkx as nx

from golfplatz.models import Chapter, Path


def chapter_to_graph(chapter: Chapter) -> nx.DiGraph:
    adventure_graph: nx.DiGraph = nx.DiGraph()
    adventure_graph.add_nodes_from(chapter.adventures.all())
    adventure_graph.add_edges_from([
        (path.from_adventure, path.to_adventure) for path in Path.objects.filter(from_adventure__chapter=chapter)
    ])
    return adventure_graph
