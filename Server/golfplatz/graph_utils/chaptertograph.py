
import networkx as nx

from golfplatz.models import Chapter, Path, Adventure


def chapter_to_graph(chapter: Chapter) -> nx.DiGraph:
    adventure_graph: nx.DiGraph = nx.DiGraph()
    adventure_graph.add_nodes_from(chapter.adventures.all())
    adventure_graph.add_edges_from([
        (path.from_adventure, path.to_adventure) for path in Path.objects.filter(from_adventure__chapter=chapter)
    ])
    for node in adventure_graph.nodes:
        for edge in list(adventure_graph.in_edges(node)):
            adventure_graph[edge[0]][edge[1]]['weight'] = node.max_points_possible
    return adventure_graph


def get_most_points_possible_in_chapter(graph: nx.DiGraph, initial_node: Adventure):
    graph.add_node('dummy')
    graph.add_edge('dummy', initial_node, weight=initial_node.max_points_possible)
    return nx.dag_longest_path_length(graph)
