/* eslint-disable radix */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
import '../styles/graph.css';

import { Button } from '@material-ui/core';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Redirect } from 'react-router-dom';

import { fromServerForm } from '../clientServerTranscoders/adventureTranscoder.js';
import graphStyle from '../styles/graphStyle.js';
import ChoicesList from './ChoicesList.js';
import contextMenuConfig from './common/graphConfig/ContextMenu.js';
import edgesConfig from './common/graphConfig/Edges.js';

class Graph extends React.Component {
  state = { chosenAdventureId: -1, elements: [], graphMode: true, layout: { name: 'breadthfirst' } };
  cy = null;
  edgeHandler = null;
  edgeContextMenu = null;
  nodeContextMenu = null;

  componentDidMount() {
    const nodes = this.getAllNodes();
    const edges = this.getAllEdges();
    const elements = nodes.concat(edges);
    const choices = this.props.choices || [];
    this.setState({ elements, choices }, () => this.cy.layout(this.state.layout).run());
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
          setTimeout(() => { this.setState({ chosenAdventureId: node.data().resId }); }, 250);
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

  mapChoices = () => {
    const protoChoices = [];
    this.cy.$('node').forEach((node) => {
      const sourceEdges = this.cy.edges("[source='" + node.data().id + "']");
      if (sourceEdges.length >= 2) {
        const pathChoices = [];
        sourceEdges.forEach((edge) => {
          const pathChoice = {
            toAdventure: parseInt(edge.data().target),
            description: '',
          };
          pathChoices.push(pathChoice);
        });

        const choice = {
          fromAdventure: node.data().resId,
          description: '',
          pathChoices,
        };
        protoChoices.push(choice);
      }
    });
    return protoChoices;
  }

  validateChoices = (protoChoices) => {
    if (!this.state.choices.length) return protoChoices;
    const { choices } = this.state;
    choices.forEach((choice) => {
      const protoChoice = protoChoices.find((c) => c.fromAdventure === choice.fromAdventure);
      if (protoChoice) {
        choice.pathChoices.forEach((pathChoice) => {
          const protoPath = protoChoice.pathChoices.find((p) => p.toAdventure === pathChoice.toAdventure);
          if (!protoPath) {
            choice.pathChoices.splice(choice.pathChoices.indexOf(pathChoice), 1);
          }
          protoChoice.pathChoices.splice(protoPath, 1);
        });

        protoChoice.pathChoices.forEach((pathProtoChoice) => {
          choice.pathChoices.push(pathProtoChoice);
        });
        protoChoices.splice(protoChoice, 1);
      } else {
        choices.splice(choices.indexOf(choice), 1);
      }
    });

    protoChoices.forEach((protoChoice) => {
      choices.push(protoChoice);
    });

    return choices;
  }

  handleSubmit = () => {
    if (this.state.graphMode) {
      const choices = this.validateChoices(this.mapChoices());
      this.edgeHandler.disable();
      this.setState({ choices, graphMode: false });
    }
    // else - uderzamy do api
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
        <div className='choices-wrapper'>
          <ChoicesList adventures={this.props.adventures} choices={this.state.choices}/>
          <Button
            variant='outlined'
            color='primary'
            onClick={this.handleSubmit}
            type='submit'
          > {this.state.graphMode ? 'Zapisz ścieżki' : 'Zapisz przejścia'}
          </Button>
        </div>
      </div>
    );
  }
}

export default Graph;
