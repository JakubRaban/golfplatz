import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {styles} from "../../styles/style.js";
import compose from 'recompose/compose';
import CssBaseline from '@material-ui/core/CssBaseline';
import { logout } from '../../actions/auth';
import NavBar from '../common/NavBar';


export class Marks extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { classes } = this.props;
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Oceny studentów'} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
        </main>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  logout: PropTypes.func.isRequired,
});

export default compose(
  connect(mapStateToProps, { logout }),
  withStyles(styles)
)(Marks);
