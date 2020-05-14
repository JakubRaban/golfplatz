import {
    GraphView,
  } from 'react-digraph';
  import React, { Component } from 'react';
  
  const GraphConfig =  {
    NodeTypes: {
      empty: { // required to show empty nodes
        typeText: "None",
        shapeId: "#empty", // relates to the type property of a node
        shape: (
          <symbol viewBox="0 0 100 100" id="empty" key="0">
            <circle cx="50" cy="50" r="45"></circle>
          </symbol>
        )
      },
      custom: { // required to show empty nodes
        typeText: "Custom",
        shapeId: "#custom", // relates to the type property of a node
        shape: (
          <symbol viewBox="0 0 50 25" id="custom" key="0">
            <ellipse cx="50" cy="25" rx="50" ry="25"></ellipse>
          </symbol>
        )
      }
    },
    NodeSubtypes: {},
    EdgeTypes: {
      emptyEdge: {  // required to show empty edges
        shapeId: "#emptyEdge",
        shape: (
          <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
            <circle cx="25" cy="25" r="8" fill="currentColor"> </circle>
          </symbol>
        )
      }
    }
  }


  const NODE_KEY = "id"       // Allows D3 to correctly update DOM
  
  class Graph extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        graph: {
          "nodes": [],
          "edges": [],
        },
        selected: {}
      }
    }

    addStartNode = () => {
      const graph = this.state.graph;
  
      graph.nodes = [
        {
          id: 1,
          title: 'Node A',
          type: 'custom',
          x: 0,
          y: 0,
        },
        ...this.state.graph.nodes,
      ];
      this.setState({
        graph,
      });
    };
    
    render() {
      const nodes = this.state.graph.nodes;
      const edges = this.state.graph.edges;
      const selected = this.state.selected;
  
      const NodeTypes = GraphConfig.NodeTypes;
      const NodeSubtypes = GraphConfig.NodeSubtypes;
      const EdgeTypes = GraphConfig.EdgeTypes;
  
      return (
        <div id='graph' style={{height: "600px"}}>
          <button onClick={this.addStartNode}>Add Node</button>
          <GraphView  ref='GraphView'
                      nodeKey={NODE_KEY}
                      nodes={nodes}
                      edges={edges}
                      selected={selected}
                      nodeTypes={NodeTypes}
                      nodeSubtypes={NodeSubtypes}
                      edgeTypes={EdgeTypes}
                      onSelectNode={this.onSelectNode}
                      onCreateNode={this.onCreateNode}
                      onUpdateNode={this.onUpdateNode}
                      onDeleteNode={this.onDeleteNode}
                      onSelectEdge={this.onSelectEdge}
                      onCreateEdge={this.onCreateEdge}
                      onSwapEdge={this.onSwapEdge}
                      onDeleteEdge={this.onDeleteEdge}/>
        </div>
      );
    }
  
  }
export default Graph;