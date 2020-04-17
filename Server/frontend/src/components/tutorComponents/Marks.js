import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


export class Marks extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <h3>Tutaj pojawi się podgląd ocen, tych których chcemy gnębić</h3>
        <NavLink to = "/tutor-dashboard">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Marks);
