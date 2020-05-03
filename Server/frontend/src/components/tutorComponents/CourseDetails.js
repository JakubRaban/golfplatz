import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourse } from "../../actions/course";


export class CourseDetails extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    course: PropTypes.any,
  };

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
          {/* {this.props.course.courseGroups} */}
        </h5>
        <h5>Części fabuły:
          {/* {this.props.course.plotParts} */}
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
