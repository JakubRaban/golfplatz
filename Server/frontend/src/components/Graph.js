import '../styles/graph.css';

import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import graphStyle from '../styles/graphStyle.js';
import contextMenuConfig from './common/graphConfig/ContextMenu.js';
import edgesConfig from './common/graphConfig/Edges.js';

class Graph extends React.Component {
  // eslint-disable-next-line max-len
  state = { adventures: [{ id: 1, label: 'xd' }, { id: 2, label: 'Palpatine' }, { id: 3, label: 'Chrzanowskie noce' }, { id: 4, label: 'Wiśniówka' }, { id: 5, label: 'Moda na sukces' }], elements: [], layout: { name: 'grid' } };
  cy = null;
  edgeHandler = null;
  contextMenu = null;

  componentDidMount() {
    const elements = this.getAllNodes();
    this.setState({ elements }, () => this.cy.layout(this.state.layout).run());
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  getAllNodes() {
    return this.state.adventures.map((adventure) => {
      return {
        data: {
          id: adventure.id,
          label: adventure.label,
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
        />
        <button onClick={this.postPaths} />
      </>
    );
  }
}

export default Graph;
