/* eslint-disable max-statements */
/* eslint-disable radix */
/* eslint-disable quotes */
/* eslint-disable prefer-template */
import '../../../styles/graph.css';

import { Button } from '@material-ui/core';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { addPathsWithDescriptions, deleteAdventure, updatePathsWithDescriptions } from '../../../actions/course.js';
import { fromServerForm } from '../../common/algorithms/clientServerTranscoders/adventureTranscoder.js';
import graphStyle from '../../../styles/graphStyle.js';
import ChoicesList from './ChoicesList.js';
import { isEmpty as empty } from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';
import { setWith } from 'lodash';
import contextMenuConfig from '../../common/graphConfig/ContextMenu.js';
import edgesConfig from '../../common/graphConfig/Edges.js';
import DeleteAdventureDialog from './DeleteAdventureDialog.js';

class Graph extends React.Component {
  state = { 
    chosenAdventureId: -1,
    dialogOpen: false,
    elements: [],
    errors: {},
    graphMode: true,
    layout: { name: 'breadthfirst' },
    nodeToDelete: null,
  };

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
          this.setState({ dialogOpen: true, nodeToDelete: node });
        },
        content: 'Usuń',
      },
    ];

    this.nodeContextMenu = this.cy.cxtmenu(contextMenuConfig);
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false, nodeToDelete: null });
  }

  handleAdventureDelete = () => {
    this.props.deleteAdventure(this.state.nodeToDelete.data().resId);
    this.cy.remove(this.state.nodeToDelete);
    this.handleDialogClose();
  }

  onDiagramCreated = (cy) => {
    if (!this.cy) {
      this.cy = cy;
      this.edgeHandler = cy.edgehandles(edgesConfig);
    }
    cy.fit();
    this.createContextMenu();
  };

  formPaths = () => {
    const paths = [];
    this.cy.$('edge').forEach((edge) => {
      paths.push({ fromAdventure: edge.data().source, toAdventure: edge.data().target });
    });
    return paths;
  }

  handleChoiceChange = (value, index, nestedIndex) => {
    const { choices } = this.state;
    const choice = choices[index];

    if (nestedIndex === undefined) choice.description = value;
    else {
      const pathChoice = choice.pathChoices[nestedIndex];
      pathChoice.description = value;
      choice.pathChoices[nestedIndex] = pathChoice;
    }
    choices[index] = choice;
    this.setState({ choices });
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
    let i = choices.length - 1;

    while (i >= 0) {
      const choice = choices[i];
      const protoChoice = protoChoices.find((c) => c.fromAdventure === choice.fromAdventure);

      if (protoChoice) {
        let j = choice.pathChoices.length - 1;
        while (j >= 0) {
          const pathChoice = choice.pathChoices[j];
          const protoPath = protoChoice.pathChoices.find((p) => p.toAdventure === pathChoice.toAdventure);
          if (!protoPath) {
            choice.pathChoices.splice(j, 1);
          }
          protoChoice.pathChoices.splice(protoChoice.pathChoices.indexOf(protoPath), 1);
          j--;
        }

        protoChoice.pathChoices.forEach((pathProtoChoice) => {
          choice.pathChoices.push(pathProtoChoice);
        });
        protoChoices.splice(protoChoices.indexOf(protoChoice), 1);
      } else {
        choices.splice(i, 1);
      }
      i--;
    }

    protoChoices.forEach((protoChoice) => {
      choices.push(protoChoice);
    });

    return choices;
  }

  checkErrors = async () => {
    const errors = {}

    this.state.choices.forEach((choice, i) => {
      if (isEmpty(choice.description)) setWith(errors, `choices[${i}].description`, 'Opis ścieżki nie może być pusty');
      choice.pathChoices.forEach((pathChoice, j) => {
        if (isEmpty(pathChoice.description)) setWith(errors, `choices[${i}].pathChoices[${j}].description`, 'Opis przejścia nie może być pusty');
      })
    });

    await this.setState({ errors });
  }

  handleSubmit = async () => {
    if (this.state.graphMode) {
      const choices = this.validateChoices(this.mapChoices());
      this.edgeHandler.disable();
      this.setState({ choices, graphMode: false });
    } else {
      await this.checkErrors();

      if (empty(this.state.errors)) {
        const paths = this.formPaths();
        const descriptions = this.state.choices;
        const submit = { paths, descriptions };

        this.props.paths.length > 0 ? this.props.updatePathsWithDescriptions(submit, this.props.chapter.id) :
          this.props.addPathsWithDescriptions(submit, this.props.chapter.id);
      }
    }
  }

  render() {
    if (this.state.chosenAdventureId !== -1) {
      const url = `/adventure/${this.state.chosenAdventureId}`;
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
          <ChoicesList
            adventures={this.props.adventures}
            choices={this.state.choices}
            errors={this.state.errors}
            handleChange={this.handleChoiceChange}/>
          <Button
            variant='outlined'
            color='primary'
            onClick={this.handleSubmit}
            type='submit'
          > {this.state.graphMode ? 'Zapisz ścieżki' : 'Zapisz przejścia'}
          </Button>
        </div>
        <DeleteAdventureDialog onDelete={this.handleAdventureDelete} onClose={this.handleDialogClose} open={this.state.dialogOpen} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  chapter: state.course.chapterDetailed,
  pathsWithDescriptions: state.course.pathsWithDescriptions,
});

export default connect(mapStateToProps, { addPathsWithDescriptions, updatePathsWithDescriptions, deleteAdventure })(Graph);
