import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourse } from "../../actions/course";
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Popup from "reactjs-popup";
import TableHead from '@material-ui/core/TableHead';
import { Form, Text, NestedForm } from "react-form";


const Chapters = ({ i }) => (
  <NestedForm field={["chapters", i]} key={`nested-chapters-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h3>Rozdział</h3>
          <label htmlFor={`nested-chapters-first-${i}`}>Nazwa</label>
          <Text field="name" id={`nested-chapters-first-${i}`} />
          <label htmlFor={`nested-chapters-last-${i}`}>Krótki opis</label>
          <Text field="introduction" id={`nested-chapters-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

export class CourseDetails extends Component {  
  state = {
    chapters: [],
  };

  firstChapter = {};

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    course: PropTypes.any,
  };

  onSubmit = (e) => {
    // e.preventDefault();
    this.state.chapters.pop();
    this.state.chapters.unshift(this.firstChapter);

    console.log(this.state.chapters);
  };

  mapAllChapters(chapterValues) {
    if (chapterValues.length === 1) {
      this.firstChapter = chapterValues[0];
    } else {
      this.state.chapters = chapterValues;
    }
  }

  componentDidMount() {
    this.props.getCourse(this.props.match.params.id);
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div>
        <h3>Oglądasz szczegóły kursu "{this.props.course.name}"</h3>
        <h5>Zajęcia odbywają się o następujących porach:
          <Table>
            <TableBody>
              { this.props.course.courseGroups.map((group, i) => (
                <TableRow key={i}>
                  <TableCell>{group}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </h5>
        <h5>Części fabuły:
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nazwa części fabuły</TableCell>
                <TableCell>Opis</TableCell>
              </TableRow>
            </TableHead>
          { this.props.course.plotParts.map((plotPart, i) => (
            <TableBody>
              <TableRow key={i}>
                <TableCell>{plotPart.name}</TableCell>
                <TableCell>{plotPart.introduction}</TableCell>
                <Popup trigger={<button> Dodaj rozdział </button>} position="right center">
                  <Form onSubmit={this.onSubmit}>
                    {formApi => (
                    <form onSubmit={formApi.submitForm} id="course-group-form">
                      <div key={0}>
                        <Chapters i={0} />
                      </div>
                      {formApi.values.chapters &&
                        formApi.values.chapters.slice(1).map((f, i) => (
                          <div key={i}>
                            <Chapters i={i} />
                          </div>
                        ), this.mapAllChapters(formApi.values.chapters))}
                      <button
                        onClick={() =>
                          formApi.addValue("chapters", {
                            name: "",
                            description: "",
                          })}
                        type="button">Dodaj kolejny rozdział</button>
                      <button type="submit">
                        Dalej
                      </button>
                    </form>
                    )}
                  </Form>
                </Popup>
              </TableRow>
            </TableBody>
           )) } 
           </Table>
        </h5>
        <NavLink to = "/">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  course: state.course.courseDetailed,
});

export default connect(mapStateToProps, {getCourse})(CourseDetails);
