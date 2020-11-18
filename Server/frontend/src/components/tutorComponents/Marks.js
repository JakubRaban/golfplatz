import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { Accordion, AccordionDetails, AccordionSummary,CssBaseline,
  List, ListItem, ListItemText, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { getCourseGrades } from '../../actions/course.js';
import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';

export class Marks extends Component {
  state = { loaded: false };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidMount() {
    this.props.getCourseGrades(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseGrades !== this.props.courseGrades) {
      this.setState({ loaded: true });
    }
  }

  getCourseName() {
    const name = this.props.courseGrades?.name || '';
    return `Oceny studentów - ${name}`;
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
    console.log(this.props);
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {this.state.loaded &&
              <>
                {this.props.courseGrades.plotParts.map((plotPart, index) =>
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
  courseGrades: state.course.courseGrades,
});

export default compose(
  connect(mapStateToProps, { logout, getCourseGrades }),
  withStyles(styles),
)(Marks);
