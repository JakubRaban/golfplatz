import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { Accordion, AccordionDetails, AccordionSummary,CssBaseline,
  List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getCourseUncheckedGrades } from '../../actions/course.js';
import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';

export class AddGrades extends Component {
  state = { loaded: false };

  theme = createMuiTheme({
    palette: {
      primary: {
        main: this.props.themeColors[0],
      },
      secondary: {
        main: this.props.themeColors[1],
      },
    },
  });

  componentDidMount() {
    this.props.getCourseUncheckedGrades(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseUncheckedGrades !== this.props.courseUncheckedGrades) {
      this.setState({ loaded: true });
    }
  }

  getCourseName() {
    const name = this.props.courseUncheckedGrades?.name || '';
    return `Oceń studentów - ${name}`;
  }

  renderAdventure = (adventure) => {
    adventure.pointSource.questions.forEach((question) => {
      if (question.grades.length !== 0) {
        return <Typography variant='body2'>Trzeba ocenić</Typography>;
      } 
    });
    return <Typography variant='body2'>Wszyściutko ocenione</Typography>;
  }

  render() {
    const { classes } = this.props;
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'} />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                  {this.props.courseUncheckedGrades.plotParts.map((plotPart, index) =>
                    <List
                      key={index}
                      component='nav'
                      aria-labelledby='nested-list-subheader'
                    >
                      <ListItem>
                        <ListItemText primary={plotPart.name} primaryTypographyProps={{ variant: 'h6' }}/>
                      </ListItem>
                      {plotPart.chapters.map((chapter, i)=> 
                        <List key={100+i} component='div' disablePadding>
                          <ListItem>
                            <ListItemText primary={chapter.name} />
                          </ListItem>
                          {chapter.adventures.map((adventure, j) => 
                            <Accordion key={1000*j}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography variant='body2'>{adventure.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {this.renderAdventure(adventure)}
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </List>
                      )}
                    </List>
                  )}
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
  courseUncheckedGrades: state.course.courseUncheckedGrades,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, { logout, getCourseUncheckedGrades }),
  withStyles(styles),
)(AddGrades);
