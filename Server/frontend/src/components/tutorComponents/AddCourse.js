import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { addCourse } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/NavBar.js';
import AddCourseConfirm from './AddCourseConfirm.js';
import AddCourseInitialInfo from './AddCourseInitialInfo.js';
import AddGroupsAndPlot from './AddGroupsAndPlot.js';


export class AddCourse extends Component {
  state = {
    step: 1,
    name: '',
    description: '',
    courseGroups: [],
    plotParts: [],
    redirect: false,
  };

  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  handleObjectChange = (input, value) => {
    this.setState({ [input]: value });
  }

  onSubmit = (e) => {
    // e.preventDefault();
    const { name, description, courseGroups, plotParts } = this.state;
    const course = { name, description };
    this.props.addCourse(course, courseGroups, plotParts);
    this.setState({
      name: '',
      description: '',
      courseGroups: [],
      plotParts: [],
      redirect: true,
    });
  };

  renderAddingStep(step, values) {
    switch (step) {
      case 1:
        return (
          <AddCourseInitialInfo
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <AddGroupsAndPlot
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleObjectChange}
            values={values}
          />
        );
      case 3:
        return (
          <AddCourseConfirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            submit={this.onSubmit}
            values={values}
          />
        );
    }
    return null;
  }

  render() {
    const { step } = this.state;
    const { name, description, courseGroups, plotParts, chapters } = this.state;
    const values = { name, description, courseGroups, plotParts, chapters };
    const { classes } = this.props;

    if (this.state.redirect) {
      return (
        <Redirect to="/courses"/>
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
          {this.renderAddingStep(step, values)}
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
