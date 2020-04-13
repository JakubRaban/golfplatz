import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../actions/course';

export class AddCourse extends Component {
  state = {
    courseName: '',
    description: '',
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
    });
  };

  render() {
    const { courseName, description } = this.state;
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
      </div>
    );
  }
}
export default connect(null, { addCourse })(AddCourse);

