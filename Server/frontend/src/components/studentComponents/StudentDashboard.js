import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth.js';
import store from '../../store'


export class StudentDashboard extends Component {
  static propTypes = {
    // logout: PropTypes.func.isRequired,
    user: PropTypes.any,
  };

  render() {;
    //rozwiazanie store.getState().... jest tymczasowe (bug z this.props..)
    return (
      <div>
        <h2>Witaj {store.getState().auth.user.firstName} {store.getState().auth.user.lastName}!</h2>
        <h3>Twoja aktualna ranga w kursie to robak.</h3>
        <Link to="/game-card">Podejrzyj kartę gry</Link> 
        <Link to="/student-marks">Zobacz swoje oceny</Link> 
        <Link to="/ranking">Podgląd rankingu</Link> 
        <Link to="/achievements">Zobacz swoje odznaki</Link> 
        {/* <button onClick={this.props.logout.bind(this)}>Wyloguj się</button> */}
      </div>

    );
  }
}

// const mapStateToProps = (state) => ({
//   user: state.auth.user,
// });

export default connect(null)(StudentDashboard);