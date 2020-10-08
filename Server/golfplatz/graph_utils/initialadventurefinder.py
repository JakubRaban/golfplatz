import networkx as nx

from golfplatz.graph_utils.errors import GraphError


def designate_initial_adventure(adventure_graph: nx.DiGraph):
    adventures_without_inbound_paths = list(filter(lambda elem: elem[1] == 0, adventure_graph.in_degree))
    number_of_possible_first_adventures = len(adventures_without_inbound_paths)
    if number_of_possible_first_adventures == 0 or number_of_possible_first_adventures > 1:
        raise GraphError("This chapter has many possible first adventures")
    initial_adventure = adventures_without_inbound_paths[0][0]
    initial_adventure.is_initial = True
    initial_adventure.save()
    return initial_adventure
