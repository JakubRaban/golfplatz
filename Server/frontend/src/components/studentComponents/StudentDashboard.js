import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import store from '../../store';


export class StudentDashboard extends Component {
  static propTypes = {
    user: PropTypes.any.isRequired,
  };

  handleClick(e) {
    e.preventDefault();
    store.dispatch(logout())
  }

  render() {
    return (
      <div>
        <h2>Witaj { this.props.user.firstName} {this.props.user.lastName}!</h2>
        <h3>Twoja aktualna ranga w kursie to robak.</h3>
        <Link to="/game-card">Podejrzyj kartę gry</Link> 
        <Link to="/student-marks">Zobacz swoje oceny</Link> 
        <Link to="/ranking">Podgląd rankingu</Link> 
        <Link to="/achievements">Zobacz swoje odznaki</Link> 
        <button onClick={event => this.handleClick(event)}>Wyloguj się</button>
      </div>

    );
  }
}

export default connect()(StudentDashboard);