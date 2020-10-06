import '../styles/graph.css';

import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import graphStyle from '../styles/graphStyle.js';
import contextMenuConfig from './common/graphConfig/ContextMenu.js';
import edgesConfig from './common/graphConfig/Edges.js';

class Graph extends React.Component {
  state = { elements: [], layout: { name: 'breadthfirst' } };
  cy = null;
  edgeHandler = null;
  contextMenu = null;

  componentDidMount() {
    const nodes = this.getAllNodes();
    const edges = this.getAllEdges();
    const elements = nodes.concat(edges);
    this.setState({ elements }, () => this.cy.layout(this.state.layout).run());
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  getAllEdges() {
    return this.props.paths.map((path) => {
      return {
        data: {
          source: path.fromAdventure,
          target: path.toAdventure,
        },
      };
    });
  }

  getAllNodes() {
    return this.props.adventures.map((adventure) => {
      return {
        data: {
          id: adventure.id,
          label: adventure.name,
        },
      };
    });
  }

  createContextMenu() {
    contextMenuConfig.commands = [
      {
        select: (edge) => {
          this.cy.remove(edge);
        },
        content: 'Usuń',
      },
    ];
    this.contextMenu = this.cy.cxtmenu(contextMenuConfig);
  }

  onDiagramCreated = (cy) => {
    if (!this.cy) {
      this.cy = cy;
      this.edgeHandler = cy.edgehandles(edgesConfig);
    }
    cy.fit();
    this.createContextMenu();
  };

  postPaths = () => {
    const paths = [];
    this.cy.$('edge').forEach((edge) => {
      paths.push({ fromAdventure: edge.data().source, toAdventure: edge.data().target });
    });
    console.log(paths);
  }

  render() {
    return (
      <>
        <CytoscapeComponent
          className='graph-container'
          cy={this.onDiagramCreated}
          elements={this.state.elements}
          hideEdgesOnViewport={true}
          maxZoom={5}
          minZoom={0.1}
          stylesheet={graphStyle}
          wheelSensitivity={0.1}
        />
        <button onClick={this.postPaths} />
      </>
    );
  }
}

export default Graph;
