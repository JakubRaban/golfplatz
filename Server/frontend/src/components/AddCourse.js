import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../actions/course';
import { NavLink, Redirect } from 'react-router-dom';


export class AddCourse extends Component {
  state = {
    courseName: '',
    description: '',
    redirect: false,
  };

  static propTypes = {
    addCourse: PropTypes.func.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { courseName, description } = this.state;
    const course = { courseName, description };
    this.props.addCourse(course);
    this.setState({
      courseName: '',
      description: '',
      redirect: true,
    });
  };

  render() {
    const { courseName, description } = this.state;
    if (this.state.redirect) {
      return (
        <Redirect to="/courses"/>
      )
    }
    return (
      <div>
        <h2>Dodaj kurs</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Podaj nazwę kursu</label>
            <input
              type="text"
              name="courseName"
              onChange={this.onChange}
              value={courseName}
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
          <div>
            <button type="submit">
              Dalej
            </button>
          </div>
        </form>
        <NavLink to="/tutor-dashboard">Powrót</NavLink>
      </div>
    );
  }
}
export default connect(null, { addCourse })(AddCourse);

