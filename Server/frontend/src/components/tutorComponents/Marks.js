import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {styles} from "./styles/style.js";
import compose from 'recompose/compose';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { logout } from '../../actions/auth';


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
        <AppBar position="absolute" className={clsx(classes.appBar, false && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton component={Link} to="/"
              edge="start"
              color="inherit"
              aria-label="Powrót"
              className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Oceny studentów
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={this.props.logout.bind(this)}>
              <Badge color="secondary">
                <PowerSettingsNewIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
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
