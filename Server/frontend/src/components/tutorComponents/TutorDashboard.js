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
import { getCourses } from '../../actions/course.js';
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
    props.getPalette(MAIN_COLOR);
    super(props);
  }

  state = {
    addGradesDialogOpen: false,
    showGradesDialogOpen: false,
    selectedCourseId: undefined,
  };

  componentDidMount() {
    this.props.getCourses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      this.setState({ loaded: true });
    }
  }

  setPalette = async (course) => {
    await this.props.getPalette(course.themeColor);
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
    await this.setState({ selectedCourseId: course.id });
  }

  handleAddGradesDialogClose = () => {
    this.setState({ addGradesDialogOpen: false });
  }

  handleAddGradesClick = () => {
    if (this.state.selectedCourseId === undefined) this.setState({ addGradesDialogOpen: true });
    else {
      this.props.history.push(`/add-grades/${this.state.selectedCourseId}`);
    }
  }

  handleShowGradesDialogClose = () => {
    this.setState({ showGradesDialogOpen: false });
  }

  handleShowGradesClick = () => {
    if (this.state.selectedCourseId === undefined) this.setState({ showGradesDialogOpen: true });
    else {
      this.props.history.push(`/grades/${this.state.selectedCourseId}`);
    }
  }

  handleCourseSelect = (selectedCourseName) => {
    const selectedCourse = this.props.courses.find((course) => course.name === selectedCourseName);

    this.setPalette(selectedCourse);
  }

  render() {
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
                logout={this.props.logout}
                title='Panel prowadzącego'
              />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth='lg' className={classes.container}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[0]}` }}>
                        <Button color='secondary' component={ Link } to='/add-courses'>
                          Dodaj nowy kurs
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[1]}` }}>
                        <Button color='secondary' component={ Link } to='/courses'>
                          Zobacz swoje kursy
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[2]}` }}>
                        <Button color='secondary' disabled={!this.state.selectedCourseId} onClick={this.handleAddGradesClick}>
                          Oceń zadania
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[3]}` }}>
                        <Button color='secondary' disabled={!this.state.selectedCourseId} onClick={this.handleShowGradesClick}>
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
});

export default compose(
  connect(mapStateToProps, { logout, getCourses, getPalette }),
  withStyles(styles),
)(withRouter(TutorDashboard));
