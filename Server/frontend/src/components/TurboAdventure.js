import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { logout } from '../actions/auth.js';
import { getAdventures,getChapter } from '../actions/course.js';
import { styles } from '../styles/style.js';
import AdventuresList from './AdventuresList.js';
import NavBar from './common/NavBar.js';
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
    const chapterId = this.props.match.params.id;
    this.props.getChapter(chapterId);
    this.props.getAdventures(chapterId);
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
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Przygody w rozdziale'} returnLink={`/courses/${this.props.course.id}`} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Tabs onChange={this.handleChange}>
            <Tab label='Lista przygód' value='text'/>
            <Tab label='Tworzenie powiązań' value='graph'/>
          </Tabs>
          {this.state.loaded && this.state.mode === 'text' ?
            <AdventuresList adventures={this.props.adventures}/> : <Graph adventures={this.props.adventures}/>}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  course: state.course.courseDetailed,
  chapter: state.course.chapterDetailed,
  adventures: state.course.adventures,
  paths: state.course.paths,
});

export default compose(
  connect(mapStateToProps, { getChapter, getAdventures, logout }),
  withStyles(styles),
)(TurboAdventure);

