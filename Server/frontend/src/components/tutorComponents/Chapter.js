import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getChapter } from "../../actions/course";


export class Chapter extends Component {  
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    chapter: PropTypes.any,
  };

  componentDidMount() {
    this.props.getChapter(this.props.match.params.id);
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
        <h3>Oglądasz szczegóły rozdziału "{this.props.chapter.name}"</h3>
        <h4>Dodaj przygody!</h4>
        <NavLink to = "/">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
});

export default connect(mapStateToProps, {getChapter})(Chapter);
