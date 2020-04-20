import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import { NavLink, Redirect } from 'react-router-dom';


export class AddCourse extends Component {
  state = {
    courseName: '',
    description: '',
    redirect: false,
  };

  static propTypes = {
    addCourse: PropTypes.func.isRequired,
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
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

