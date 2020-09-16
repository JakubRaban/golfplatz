import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';
import DashboardNavbar from '../common/DashboardNavbar.js';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://material-ui.com/">
        Golfplatz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export class StudentDashboard extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleDrawerClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      );
    }
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <DashboardNavbar title={'Panel uczestnika kursu'} handleDrawerOpen={this.handleDrawerOpen}
          handleDrawerClose={this.handleDrawerClose} logout={this.props.logout} open={this.state.open}
        />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <h2>Witaj { this.props.user.firstName} {this.props.user.lastName}!</h2>
          <h3>Twoja aktualna ranga w kursie to robak.</h3>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Link to="/game-card">Podejrzyj kartę gry</Link>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Link to="/student-marks">Zobacz swoje oceny</Link>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Link to="/achievements">Zobacz swoje odznaki</Link>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper.paper}>
                  <div>można go wyrenderować tutaj</div>
                  <Link to="/ranking">Podgląd rankingu</Link>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={classes.paper}>
                  <div> To będzie dostępne tylko o określonym czasie</div>
                  <Link to="/open-chapter/6">Podejmij wyzwanie!</Link>
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { logout }),
  withStyles(styles),
)(StudentDashboard);
