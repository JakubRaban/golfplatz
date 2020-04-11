import React, {Component} from "react";
import { getCourses } from "../actions/course";
import {connect} from "react-redux";
import PropTypes from "prop-types"

export class GetCourses extends Component {

  static propTypes = {
    course: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.getCourses();
  }

  render() {
    return (
      <div>
        <h1>Lista kursów</h1>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa kursu</th>
            <th>Opis</th>
            <th>Utworzono</th>
          </tr>
          </thead>
          <tbody>
          { this.props.course.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.course_name}</td>
              <td>{course.description}</td>
              <td>{course.created_on}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  course: state.course.course
});

export default connect(mapStateToProps, {getCourses})(GetCourses)