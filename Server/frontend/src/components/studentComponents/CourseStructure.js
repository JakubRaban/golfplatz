import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import NavBar from '../common/navbars/NavBar.js';
import compose from 'recompose/compose';
import {CssBaseline, List, ListItem, ListItemText, ListSubheader, Typography} from '@material-ui/core';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

import {getCourseStructure} from '../../actions/course.js';
import {logout} from '../../actions/auth.js';
import {styles} from '../../styles/style.js';

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export class CourseStructure extends Component {
  state = {loaded: false};

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

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
    this.props.getCourseStructure(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseStructure !== this.props.courseStructure) {
      this.setState({loaded: true});
    }
  }

  getCourseName() {
    const name = this.props.courseStructure?.name || '';
    return `Widok kursu ${name}`;
  }

  renderPlotPart = (index, plotPart) => {
    return (
      <List
        key={index}
        component='nav'
        aria-labelledby='nested-list-subheader'
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            {index + 1} część fabuły kursu:
          </ListSubheader>
        }
      >
        {plotPart.isUnlocked ? (
          <>
            <Typography component='h6' variant='subtitle1'>
              {plotPart.name}
            </Typography>
            <hr/>
            <Typography component='h6' variant='body2'>
              {plotPart.introduction}
            </Typography>
            <ListItem>
              <ListItemText primary='Rozdziały:'/>
            </ListItem>
            {plotPart.chapters.map((chapter, i, chapters) =>
              <List key={100 + i} component='div' disablePadding>
                {this.renderChapter(i, chapter, chapters)}
              </List>
            )}
          </>
        ) : (
          <Typography component='h6' variant='subtitle1' color="secondary">
            {plotPart.name} - Twój prowadzący twierdzi, że tu jest jeszcze zbyt niebezpiecznie
          </Typography>
        )}

      </List>
    )
  }

  renderChapter = (index, chapter, chapters) => {
    const prevChapter = index > 0 ? chapters[index - 1] : undefined
    return chapter.accomplishedChapters.length > 0 && chapter.accomplishedChapters[0].isCompleted ? (
      <ListItem>
        <ListItemText secondary={
          `${chapter.name} - Ukończono: ${new Date(chapter.accomplishedChapters[0].timeCompleted).toLocaleString('pl-PL')}`
        }/>
      </ListItem>
    ) : prevChapter && prevChapter.accomplishedChapters.length === 0 || !prevChapter.accomplishedChapters[0].isCompleted ? (
      <ListItem>
        <ListItemText secondary={`${chapter.name} - przejdź poprzednie rozdziały zanim zaczniesz ten`} />
      </ListItem>
    ) : (
      <ListItemLink href={`/#/open-chapter/${chapter.id}`}>
        <ListItemText secondary={chapter.name} secondaryTypographyProps={{color: 'primary'}}/>
      </ListItemLink>
    );
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to='/login'/>;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to='/'/>
      );
    }
    const {classes} = this.props;
    console.log(this.props);
    return (
      <ThemeProvider theme={this.theme}>
        <div className={classes.root}>
          <CssBaseline/>
          <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'}/>
          <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <div style={{margin: '5px'}}>
              {this.state.loaded &&
              <>
                <Typography component='h6' variant='h6'>
                  {this.props.courseStructure.description}
                </Typography>
                {this.props.courseStructure.plotParts.map((plotPart, index) =>
                  this.renderPlotPart(index, plotPart)
                )}
              </>
              }
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  courseStructure: state.course.courseStructure,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, {logout, getCourseStructure}),
  withStyles(styles),
)(CourseStructure);
