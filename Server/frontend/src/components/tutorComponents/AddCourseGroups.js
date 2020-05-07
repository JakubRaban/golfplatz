import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Text, NestedForm } from "react-form";


const CourseGroup = ({ i }) => (
  <NestedForm field={["courseGroups", i]} key={`nested-course-group-${i}`}>
    <Form>
      {formApi => (
        <div>
          <label htmlFor={`nested-course-group-first-${i}`}>Dzień i godzina zajęć</label>
          <Text field="groupName" id={`nested-course-group-first-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

export class AddCourseGroups extends Component {
  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  continue = e => {
    e.preventDefault();
    this.props.values.courseGroups.pop();
    this.props.values.courseGroups.unshift(this.firstCourseGroup);
    this.props.handleChange(this.props.values.courseGroups);
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  firstCourseGroup = {};

  mapAllGroups(groupsValues) {
    if (groupsValues.length === 1) {
      this.firstCourseGroup = groupsValues[0];
    } else {
      this.props.values.courseGroups = groupsValues;
    }
  }

  render() {
    return(
      <div>
        <Form onSubmit={this.onSubmit}>
        {formApi => (
          <div>
            <form onSubmit={formApi.submitForm} id="course-group-form">
              <div key={0}>
                <CourseGroup i={0} />
              </div>
              {formApi.values.courseGroups &&
                formApi.values.courseGroups.slice(1).map((f, i) => (
                  <div key={i}>
                    <CourseGroup i={i} />
                  </div>
                ), this.mapAllGroups(formApi.values.courseGroups))}
              <button
                onClick={() =>
                  formApi.addValue("courseGroups", {
                    groupName: "",
                  })}
                type="button">Dodaj kolejny termin zajęć</button>

              <button onClick={this.continue}>
                Dalej
              </button>
            </form>
          </div>
        )}
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AddCourseGroups);