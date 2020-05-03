import React, {Component} from "react";
import { getCourses } from "../actions/course";
import {connect} from "react-redux";
import PropTypes from "prop-types"
import { NavLink, Link } from 'react-router-dom';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';


export class GetCourses extends Component {
  static propTypes = {
    courses: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.getCourses();
  }
  //dodać ładny hover na tabelkę, a wcześniej sprawdzić, czy jest w cssach materiala
  render() {
    return (
      <div>
        <h1>Lista kursów</h1>
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nazwa kursu</TableCell>
              <TableCell>Opis</TableCell>
              <TableCell>Utworzono</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          { this.props.courses.map(course => (
            <TableRow component={Link} to={`/courses/${course.id}/`} key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.createdOn}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        <NavLink to="/">Powrót</NavLink>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  courses: state.course.courses
});

export default connect(mapStateToProps, {getCourses})(GetCourses)