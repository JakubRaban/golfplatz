import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import compose from 'recompose/compose';
import {styles} from "../../styles/style.js";
import DashboardNavbar from '../common/DashboardNavbar';

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


export class TutorDashboard extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
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
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    let open = this.state.open;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <DashboardNavbar title={'Panel prowadzącego'} handleDrawerOpen={this.handleDrawerOpen}
           handleDrawerClose={this.handleDrawerClose} logout={this.props.logout} open={this.state.open}
        />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Link to="/add-courses">Dodaj nowy kurs</Link>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Link to="/courses">Zobacz swoje kursy</Link> 
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Link to="/marks">Podgląd ocen</Link> 
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

export default compose(
  connect(null, { logout }),
  withStyles(styles)
)(TutorDashboard);
