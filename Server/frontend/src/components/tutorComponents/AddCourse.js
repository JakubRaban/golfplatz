import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import { Redirect } from 'react-router-dom';
import AddCourseInitialInfo from "./AddCourseInitialInfo";
import AddCourseGroups from "./AddCourseGroups";
import AddPlotParts from "./AddPlotParts";
import AddCourseConfirm from "./AddCourseConfirm";


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
      step: step + 1
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleGroupChange = value => {
    this.setState({ courseGroups: value });
  }

  handlePlotPartsChange = value => {
    this.setState({ plotParts: value });
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

  render() {
    const { step } = this.state;
    const { name, description, courseGroups, plotParts } = this.state;
    const values = { name, description, courseGroups, plotParts };
    if (this.state.redirect) {
      return (
        <Redirect to="/courses"/>
      )
    }
    if (!this.props.isAuthenticated) {
      return (
        <Redirect to="/login"/>
      )
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    <h2>Dodaj kurs</h2>
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
          <AddCourseGroups
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleGroupChange}
            values={values}
          />
        );
      case 3:
        return (
          <AddPlotParts
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handlePlotPartsChange}
            values={values}
          />
        );
      case 4:
        return (
          <AddCourseConfirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            submit={this.onSubmit}
            values={values}
          />
        );
    }
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {addCourse})(AddCourse);
