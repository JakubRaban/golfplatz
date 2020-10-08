import '../styles/graph.css';

import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Redirect } from 'react-router-dom';

import { fromServerForm } from '../clientServerTranscoders/adventureTranscoder.js';
import graphStyle from '../styles/graphStyle.js';
import ChoicesList from './ChoicesList.js';
import contextMenuConfig from './common/graphConfig/ContextMenu.js';
import edgesConfig from './common/graphConfig/Edges.js';

class Graph extends React.Component {
  state = { chosenAdventureId: -1, elements: [], layout: { name: 'breadthfirst' } };
  cy = null;
  edgeHandler = null;
  edgeContextMenu = null;
  nodeContextMenu = null;

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
          resId: adventure.id, // duplikat z powodów bibliotecznych
          label: adventure.name,
        },
      };
    });
  }

  createContextMenu() {
    contextMenuConfig.selector = 'edge';
    contextMenuConfig.commands = [
      {
        select: (edge) => {
          this.cy.remove(edge);
        },
        content: 'Usuń',
      },
    ];
    this.edgeContextMenu = this.cy.cxtmenu(contextMenuConfig);

    contextMenuConfig.selector = 'node';
    contextMenuConfig.commands = [
      {
        select: (node) => {
          this.setState({ chosenAdventureId: node.data().resId });
        },
        content: 'Edytuj',
      },
      {
        select: (node) => {
          this.cy.remove(node);
        },
        content: 'Usuń',
      },
    ];

    this.nodeContextMenu = this.cy.cxtmenu(contextMenuConfig);
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
    if (this.state.chosenAdventureId !== -1) {
      const url = `/adventure/${this.state.chosenAdventureId}`;
      console.log(url);
      return (
        <Redirect to={
          {
            pathname: url,
            state: {
              adventure: fromServerForm(this.props.adventures.find((adventure) => adventure.id === this.state.chosenAdventureId)),
            },
          }
        }/>
      );
    }
    return (
      <div className='graph-view'>
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
        <ChoicesList adventures={this.props.adventures} choices={this.props.choices}/>
      </div>
    );
  }
}

export default Graph;
