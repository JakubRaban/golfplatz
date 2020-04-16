import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { Link } from 'react-router-dom';


export class TutorDashboard extends Component {
	static propTypes = {
    logout: PropTypes.func.isRequired,
  };

	render() {
		return (
      <div>
        <h3>Panel prowadzącego</h3>
        <Link to="/add-courses">Dodaj nowy kurs</Link> 
        <Link to="/courses">Zobacz swoje kursy</Link> 
        <Link to="/marks">Podgląd ocen</Link> 
        <button onClick={this.props.logout.bind(this)}>Wyloguj się</button>

      </div>
		);
	}
}

export default connect(null, { logout })(TutorDashboard);