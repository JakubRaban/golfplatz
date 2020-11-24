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
import { getPalette } from '../../actions/color.js';
import LinearProgress from '@material-ui/core/LinearProgress';

import { logout } from '../../actions/auth.js';
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
  state = {
    dialogOpen: false,
    open: false,
  };

  theme = createMuiTheme();

  componentDidMount() {
    this.props.getCourses();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      this.setPalette();
    }
  }

  setPalette = async () => {
    await this.props.getPalette(this.props.courses[10].themeColor);
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
    await this.setState({ loaded: true });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  }

  render() {
    const { classes, palette } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    console.log(this.theme);
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <DashboardNavbar 
                title='Panel prowadzącego' logout={this.props.logout} open={this.state.open}
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
                        <Button color='secondary' onClick={this.handleDialogOpen}>
                          Oceń zadania
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={6}>
                      <Paper className={fixedHeightPaper} style={{ backgroundColor: `#${palette[3]}` }}>
                        <Button color='secondary' disabled onClick={this.handleDialogOpen}>
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
)(TutorDashboard);
