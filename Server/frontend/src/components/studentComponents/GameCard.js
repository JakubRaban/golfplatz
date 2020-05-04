import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


export class GameCard extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div>
        <h3>Tutaj pojawi się karta gry</h3>
        <NavLink to = "/">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(GameCard);
