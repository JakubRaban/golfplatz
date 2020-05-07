import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import { Redirect } from 'react-router-dom';
import AddCourseInitialInfo from "./AddCourseInitialInfo";
import AddGroupsAndPlot from "./AddGroupsAndPlot";
import AddCourseConfirm from "./AddCourseConfirm";


export class AddCourse extends Component {
  state = {
    step: 1,
    name: '',
    description: '',
    courseGroups: [],
    plotParts: [],
    redirect: false,
    chapters: [],
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

  handleObjectChange = (input, value) => {
    this.setState({ [input]: value });
  }

  onSubmit = (e) => {
    // e.preventDefault();
    const { name, description, courseGroups, plotParts, chapters } = this.state;
    const course = { name, description };
    this.props.addCourse(course, courseGroups, plotParts, chapters);
    this.setState({
      name: '',
      description: '',
      courseGroups: [],
      plotParts: [],
      redirect: true,
      chapters: [],
    });
  };

  render() {
    const { step } = this.state;
    const { name, description, courseGroups, plotParts, chapters } = this.state;
    const values = { name, description, courseGroups, plotParts, chapters };
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
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {addCourse})(AddCourse);
