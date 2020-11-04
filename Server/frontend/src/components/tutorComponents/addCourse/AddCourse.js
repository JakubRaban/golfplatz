import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../../actions/auth.js';
import { addCourse } from '../../../actions/course.js';
import { styles } from '../../../styles/style.js';
import NavBar from '../../common/NavBar.js';
import AddAchievements from './AddAchievements.js';
import AddCourseInitialInfo from './AddCourseInitialInfo.js';
import AddGroupsAndPlot from './AddGroupsAndPlot.js';

export class AddCourse extends Component {
  state = {
    name: '',
    description: '',
    courseGroups: [''],
    plotParts: [{ name: '', introduction: '' }],
    redirect: false,
    achievements: [],
  };

  emptyAchievement = {
    name: '',
    image: '',
    courseElementConsidered: 'NOT SELECTED',
    howMany: 0,
    inARow: false,
    conditionType: 'NOT SELECTED',
    percentage: 0,
  }

  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  addNewAchievement = () => {
    const { achievements } = this.state;
    achievements.push({ ...this.emptyAchievement });
    this.setState({ achievements });
  }

  handleAchievementChange = (input, index, value) => {
    const { achievements } = this.state;
    achievements[index][input] = value;
    this.setState({ achievements });
  }

  addNewCourseGroup = () => {
    const { courseGroups } = this.state;
    courseGroups.push('');
    this.setState({ courseGroups });
  }

  handleGroupChange = (index, value) => {
    const { courseGroups } = this.state;
    courseGroups[index] = value;
    this.setState({ courseGroups });
  }

  addNewPlotPart = () => {
    const { plotParts } = this.state;
    plotParts.push({ name: '', introduction: '' });
    this.setState({ plotParts });
  }

  handlePlotPartChange = (input, index, value) => {
    const { plotParts } = this.state;
    plotParts[index][input] = value;
    this.setState({ plotParts });
  }

  onSubmit = (e) => {
    // e.preventDefault();
    const { name, description, courseGroups, plotParts, achievements } = this.state;
    const course = { name, description };
    console.log(this.state);
    this.props.addCourse(course, courseGroups, plotParts, achievements);
    this.setState({ redirect: true });
  };

  render() {
    const { name, description, courseGroups, plotParts } = this.state;
    const values = { name, description };
    const { classes } = this.props;

    if (this.state.redirect) {
      return (
        <Redirect to="/"/>
      );
    }
    if (!this.props.isAuthenticated) {
      return (
        <Redirect to="/login"/>
      );
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Dodaj kurs'} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <AddCourseInitialInfo
            handleChange={this.handleChange}
            values={values}
          />
          <AddGroupsAndPlot
            addNewCourseGroup={this.addNewCourseGroup}
            addNewPlotPart={this.addNewPlotPart}
            groups={courseGroups}
            handleGroupChange={this.handleGroupChange}
            handlePlotPartChange={this.handlePlotPartChange}
            plotParts={plotParts}
          />
          <AddAchievements
            achievements={this.state.achievements}
            addNewAchievement={this.addNewAchievement}
            handleAchievementChange={this.handleAchievementChange}
            handlePlotPartChange={this.handlePlotPartChange}
          />
          <div style={{ float: 'right', marginBottom: '10px', marginRight: '5px' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.onSubmit}
            >Potwierdź i wyślij</Button>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { addCourse, logout }),
  withStyles(styles),
)(AddCourse);
