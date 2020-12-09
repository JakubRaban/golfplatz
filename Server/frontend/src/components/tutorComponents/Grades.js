import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { CssBaseline, Tab, Tabs, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { saveAs } from 'file-saver';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getCourseGrades, exportGrades, getTutorRanking } from '../../actions/course.js';
import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';
import TutorRanking from './TutorRanking.js';
import GradesDetails from './GradesDetails.js';

export class Grades extends Component {
  state = { loaded: false, mode: 'grades' };

  theme = createMuiTheme({
    palette: {
      primary: {
        main: this.props.themeColors[0],
      },
      secondary: {
        main: this.props.themeColors[1],
      },
    },
  });

  async componentDidMount() {
    await this.props.getTutorRanking(this.props.match.params.id);
    await this.props.getCourseGrades(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseGrades !== this.props.courseGrades) {
      this.setState({ loaded: true });
    }
  }

  handleChange = (e, mode) => {
    this.setState({ mode });
  }

  getCourseName() {
    const name = this.props.courseGrades?.courseName || '';
    return `Oceny studentów - ${name}`;
  }

  export = async () => {
    await this.props.exportGrades(this.props.match.params.id);
    await saveAs(this.props.csv, `wyniki-${this.props.courseGrades?.courseName}.csv`);
  }

  renderTab() {
    switch(this.state.mode) {
      case 'grades':
        return <GradesDetails courseGrades={this.props.courseGrades} export={this.export} />;
      case 'ranking':
        return <TutorRanking ranking={this.props.ranking} />;
    }
  }

  render() {
    const { classes } = this.props;
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'} />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <>
                  <Tabs value={this.state.mode} onChange={this.handleChange}>
                    <Tab label='Oceny' value='grades'/>
                    <Tab label='Ranking' value='ranking'/>
                  </Tabs>
                  {this.renderTab()}
                </>
              </main>
            </div>
          </ThemeProvider> : <LinearProgress />
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  courseGrades: state.course.courseGrades,
  csv: state.course.csv,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
  ranking: state.course.ranking,
});

export default compose(
  connect(mapStateToProps, { logout, getCourseGrades, exportGrades, getTutorRanking }),
  withStyles(styles),
)(Grades);
