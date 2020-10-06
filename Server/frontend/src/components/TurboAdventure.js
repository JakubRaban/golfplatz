import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { logout } from '../actions/auth.js';
import { getAdventures } from '../actions/course.js';
import { styles } from '../styles/style.js';
import AdventuresList from './AdventuresList.js';
import Graph from './Graph.js';

export class TurboAdventure extends Component {
  state = {
    mode: 'text',
    loaded: false,
  };

  static propTypes = {
    adventures: PropTypes.any.isRequired,
  };

  componentDidMount() {
    this.props.getAdventures(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.adventures !== prevProps.adventures) {
      this.setState({ loaded: true });
    }
  }

  handleChange = (e, mode) => {
    this.setState({ mode });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <h4>Tworzenie przygód w rozdziale</h4>

        <Tabs onChange={this.handleChange}>
          <Tab label='Lista przygód' value='text'/>
          <Tab label='Tworzenie powiązań' value='graph'/>
        </Tabs>

        {this.state.loaded && this.state.mode === 'text' ?
          <AdventuresList adventures={this.props.adventures}/> : <Graph adventures={this.props.adventures}/>}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  adventures: state.course.adventures,
  paths: state.course.paths,
});

export default compose(
  connect(mapStateToProps, { getAdventures, logout }),
  withStyles(styles),
)(TurboAdventure);

