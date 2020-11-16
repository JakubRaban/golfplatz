import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { getCourses } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import DashboardNavbar from '../common/navbars/DashboardNavbar.js';
import ChooseCourseDialog from './ChooseCourseDialog.js';

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
    drawerOpen: false,
    dialogOpen: false,
    loaded: false,
  };

  componentDidMount() {
    this.props.getCourses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      this.setState({ loaded: true });
    }
  }

  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true,
    });
  }

  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false,
    });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
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
          handleDrawerClose={this.handleDrawerClose} logout={this.props.logout} open={this.state.drawerOpen}
        />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <h2>Witaj { this.props.user.firstName} {this.props.user.lastName}!</h2>
          {this.state.loaded &&
          <>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                    <Button color="primary" onClick={this.handleDialogOpen}>
                      Podejrzyj kartę gry
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div> To będzie dostępne tylko o określonym czasie</div>
                    <Link to="/open-chapter/16">Podejmij wyzwanie!</Link>
                  </Paper>
                </Grid>
              </Grid>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
            <ChooseCourseDialog courses={this.props.courses} onClose={this.handleDialogClose} open={this.state.dialogOpen} />
          </>
          }
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  courses: state.course.courses
});

export default compose(
  connect(mapStateToProps, { logout, getCourses }),
  withStyles(styles),
)(StudentDashboard);
