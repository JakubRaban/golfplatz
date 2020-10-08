import networkx as nx

from golfplatz.graph_utils.errors import GraphError
from golfplatz.models import Adventure


def verify_adventure_graph(adventure_graph: nx.DiGraph, initial_adventure: Adventure):
    _has_no_cycles(adventure_graph, initial_adventure),
    _all_adventures_reachable(adventure_graph, initial_adventure)


def _has_no_cycles(adventure_graph: nx.DiGraph, initial_adventure: Adventure):
    try:
        nx.find_cycle(adventure_graph, source=initial_adventure, orientation='original')
    except nx.NetworkXNoCycle:
        pass
    else:
        raise GraphError("Adventures in this chapter could repeat")


def _all_adventures_reachable(adventure_graph: nx.DiGraph, initial_adventure: Adventure):
    if len(nx.descendants(adventure_graph, initial_adventure)) != len(adventure_graph.nodes) - 1:
        raise GraphError("Some adventures are not reachable from the first one")
