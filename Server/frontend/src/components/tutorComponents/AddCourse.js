import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Text, NestedForm } from "react-form";


const PlotPart = ({ i }) => (
  <NestedForm field={["plotParts", i]} key={`nested-plot-part-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Część fabuły</h3>
          <label htmlFor={`nested-plot-part-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-plot-part-first-${i}`} />
          <label htmlFor={`nested-plot-part-last-${i}`}>Krótki opis</label>
          <Text field="introduction" id={`nested-plot-part-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

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

export class AddCourse extends Component {
  state = {
    name: '',
    description: '',
    courseGroups: [],
    plotParts: [],
    redirect: false,
  };

  static propTypes = {
    addCourse: PropTypes.func.isRequired,
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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
    const { name, description } = this.state;
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
    return (
      <div>
        <h2>Dodaj kurs</h2>
        <Form onSubmit={this.onSubmit}>
          {formApi => (
            <div>
              <div>
                <label>Podaj nazwę kursu</label>
                <input
                  type="text"
                  name="name"
                  onChange={this.onChange}
                  value={name}
                />
              </div>
              <div>
                <label>Krótko opisz kurs</label>
                <textarea
                  type="text"
                  name="description"
                  onChange={this.onChange}
                  value={description}
                />
              </div>
              <form onSubmit={formApi.submitForm} id="course-group-form">
                {formApi.values.courseGroups &&
                  formApi.values.courseGroups.map((f, i) => (
                    <div key={i}>
                      <CourseGroup i={i} />
                    </div>
                  ), this.state.courseGroups = formApi.values.courseGroups)}
                <button
                  onClick={() =>
                    formApi.addValue("courseGroups", {
                      groupName: "",
                    })}
                  type="button">Dodaj termin zajęć</button>
              </form>
              <form onSubmit={formApi.submitForm} id="plot-form">
                {formApi.values.plotParts &&
                  formApi.values.plotParts.map((f, i) => (
                    <div key={i}>
                      <PlotPart i={i} />
                      <button
                        onClick={() => formApi.removeValue("plotParts", i)}
                        type="button">Usuń</button>
                    </div>
                    
                  ), this.state.plotParts = formApi.values.plotParts)}
                <button
                  onClick={() =>
                    formApi.addValue("plotParts", {
                      name: "",
                      introduction: ""
                    })}
                  type="button">Dodaj część fabuły</button>
                <button type="submit">
                  Dalej
                </button>
              </form>
            </div>
          )}
          
        </Form>
        <NavLink to="/">Powrót</NavLink>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { addCourse })(AddCourse);

