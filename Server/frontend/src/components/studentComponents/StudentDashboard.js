import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { LinearProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/auth.js';
import { getPalette } from '../../actions/color.js';
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

export class StudentDashboard extends Component {
  theme = createMuiTheme();

  constructor(props) {
    super(props);
  }

  state = {
    dialogOpen: false,
    dialogOpen2: false,
    loaded: false,
    selectedCourseId: undefined,
  };

  componentDidMount() {
    this.props.getCourses();
    this.setPalette(this.props.activeCourse);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      this.setState({ loaded: true });
    }
  }

  // handleDialogClose = () => {
  //   this.setState({ dialogOpen: false });
  // }

  handleGameCardOpen = () => {
    this.props.history.push(`/game-card/${this.props.activeCourse.id}`);
  }

  // handleDialog2Close = () => {
  //   this.setState({ dialogOpen2: false });
  // }

  handleCourseStructureOpen = () => {
    this.props.history.push(`/course-structure/${this.props.activeCourse.id}`);
  }

  setPalette = async (course) => {
    await this.props.getPalette(course);
    this.theme = await createMuiTheme({
      palette: {
        primary: {
          main: this.props.themeColors[0],
        },
        secondary: {
          main: this.props.themeColors[1],
        },
      },
    });
  }

  handleCourseSelect = async (e) => {
    await this.setPalette(e.target.value);
    this.setPalette(this.props.activeCourse);
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
    const { classes, palette } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <DashboardNavbar
                courses={this.props.courses}
                handleChange={this.handleCourseSelect}
                isTutor={false}
                logout={this.props.logout}
                title={'Panel uczestnika kursu'}
              />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={12}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[0]}` }}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} disabled={!this.props.activeCourse} onClick={this.handleGameCardOpen}>
                          Podejrzyj kartę gry
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={8} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[1]}`}}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} disabled={!this.props.activeCourse} onClick={this.handleCourseStructureOpen}>
                          Podejmij wyzwanie!
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={8} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[2]}`}}>
                        <Button disabled>
                          Zapisz się do kursu
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box pt={4}>
                    <Copyright />
                  </Box>
                </Container>
                {/* <ChooseCourseDialog courses={this.props.courses} link='game-card' onClose={this.handleDialogClose} open={this.state.dialogOpen} title='Wybierz kurs, którego kartę gry chcesz zobaczyć'/>
                <ChooseCourseDialog courses={this.props.courses} link='course-structure' onClose={this.handleDialog2Close} open={this.state.dialogOpen2} title='Wybierz kurs, którego rozdział chcesz przejść'/> */}
              </main>
            </div>
          </ThemeProvider> : <LinearProgress />
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  courses: state.course.courses,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
  activeCourse: state.course.active,
});

export default compose(
  connect(mapStateToProps, { logout, getCourses, getPalette }),
  withStyles(styles),
)(withRouter(StudentDashboard));
