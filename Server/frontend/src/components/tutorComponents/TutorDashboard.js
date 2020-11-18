import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { getCourses } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import DashboardNavbar from '../common/navbars/DashboardNavbar.js';
import ChooseCourseDialog from '../common/ChooseCourseDialog.js';

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
  state = {
    dialogOpen: false,
    open: false,
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
      open: true,
    });
  }

  handleDrawerClose = () => {
    this.setState({
      open: false,
    });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  }

  render() {
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
                  <Button color="primary" onClick={this.handleDialogOpen}>
                    Podgląd ocen
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
          <ChooseCourseDialog courses={this.props.courses} link='marks' onClose={this.handleDialogClose} open={this.state.dialogOpen} title='Wybierz kurs, z którego oceny chcesz zobaczyć'/>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  courses: state.course.courses,
});

export default compose(
  connect(mapStateToProps, { logout, getCourses }),
  withStyles(styles),
)(TutorDashboard);
