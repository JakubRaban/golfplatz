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
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/auth.js';
import { getPalette, MAIN_COLOR } from '../../actions/color.js';
import { getCourses, getSystemKey } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import DashboardNavbar from '../common/navbars/DashboardNavbar.js';
import ChooseCourseDialog from '../common/ChooseCourseDialog.js';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' to='https://material-ui.com/'>
        Golfplatz
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export class TutorDashboard extends Component {
  theme = createMuiTheme();

  constructor(props) {
    super(props);
  }

  state = {
    addGradesDialogOpen: false,
    showGradesDialogOpen: false,
  };

  componentDidMount() {
    this.props.getSystemKey();
    this.props.getCourses();
    this.setPalette(this.props.activeCourse);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      this.setState({ loaded: true });
    }
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

  handleAddGradesDialogClose = () => {
    this.setState({ addGradesDialogOpen: false });
  }

  handleAddGradesClick = () => {
    if (this.props.activeCourse === undefined) this.setState({ addGradesDialogOpen: true });
    else {
      this.props.history.push(`/add-grades/${this.props.activeCourse.id}`);
    }
  }

  handleShowGradesDialogClose = () => {
    this.setState({ showGradesDialogOpen: false });
  }

  handleShowGradesClick = () => {
    if (this.props.activeCourse === undefined) this.setState({ showGradesDialogOpen: true });
    else {
      this.props.history.push(`/grades/${this.props.activeCourse.id}`);
    }
  }

  handleCourseSelect = (e) => {
    const course = this.props.courses.find((course) => course.name === e.target.value)
    this.setPalette(course);
  }

  render() {
    const { classes, palette } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    console.log(this.props);
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <DashboardNavbar
                courses={this.props.courses}
                handleChange={this.handleCourseSelect}
                isTutor
                logout={this.props.logout}
                systemKey={this.props?.systemKey}
                activeCourse={this.props.activeCourse}
                title='Panel prowadzącego'
              />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth='lg' className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[0]}` }}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} component={ Link } to='/add-courses'>
                          Dodaj nowy kurs
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[1]}` }}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} component={ Link } to='/courses'>
                          Zobacz swoje kursy
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[2]}` }}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} disabled={!this.props.activeCourse} onClick={this.handleAddGradesClick}>
                          Oceń zadania
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[3]}` }}>
                        <Button style={{ color: this.theme.palette.primary.contrastText }} disabled={!this.props.activeCourse} onClick={this.handleShowGradesClick}>
                          Podgląd ocen
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                  <Box pt={4}>
                    <Copyright />
                  </Box>
                </Container>
                {/* <ChooseCourseDialog
                  courses={this.props.courses}
                  link='add-grades'
                  onClose={this.handleAddGradesDialogClose}
                  open={this.state.addGradesDialogOpen}
                  title='Wybierz kurs, z którego oceny chcesz wprowadzić'
                />
                <ChooseCourseDialog
                  courses={this.props.courses}
                  link='grades'
                  onClose={this.handleShowGradesDialogClose}
                  open={this.state.showGradesDialogOpen}
                  title='Wybierz kurs, z którego oceny chcesz zobaczyć'
                /> */}
              </main>
            </div>
          </ThemeProvider> : <LinearProgress />
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  courses: state.course.courses,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
  systemKey: state.course.systemKey,
  activeCourse: state.course.activeCourse,
});

export default compose(
  connect(mapStateToProps, { logout, getCourses, getPalette, getSystemKey }),
  withStyles(styles),
)(withRouter(TutorDashboard));
