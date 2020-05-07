import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Text, NestedForm } from "react-form";


export class AddCourseConfirm extends Component {
  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  continue = e => {
    e.preventDefault();
    this.props.submit();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
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
    const {
      values: { name, description, courseGroups, plotParts }
    } = this.props;
    console.log(name);
    console.log(description);
    console.log(courseGroups);
    console.log(plotParts);
    return(
      <div>
        <button onClick={this.continue}>
          Potwierdź i wyślij
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddCourseConfirm);