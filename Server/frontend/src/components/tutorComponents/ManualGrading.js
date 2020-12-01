import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button, CssBaseline, Typography, TextField } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { get, isEmpty as empty, setWith } from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';

import { logout } from '../../actions/auth.js';
import { gradeManual } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';

export class ManualGrading extends Component {
  state = { addedGrades: [], errors: {}, loaded: false };

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
    const { plotPartIndex } = this.props.match.params;
    const { chapterIndex } = this.props.match.params;
    const { adventureId } = this.props.match.params;

    const chapter = this.props.courseUncheckedGrades.plotParts[plotPartIndex].chapters[chapterIndex];
    const adventure = chapter.adventures.find((adv) => adv.id == adventureId);
    const addedGrades = [];
    adventure.pointSource.questions.forEach((question, i) => {
      if (question.grades.length !== 0) {
        question.grades.forEach((grade) => addedGrades.push({ grade: grade.id, points: '' }));
      }
    });
    this.setState({ addedGrades, adventure, loaded: true });
  }

  getAdventureName() {
    const name = this.state.adventure?.name || '';
    return `Oceń przygodę - ${name}`;
  }

  checkErrors = async () => {
    const errors = {}
    this.state.addedGrades.forEach((addedGrade, i) => {
      if (empty(addedGrade.points)) setWith(errors, `addedGrades[${i}].points`, 'Ocena nie może być pusta');
    });
    console.log(errors);
    await this.setState({ errors })
  }

  submitGrades = async () => {
    await this.checkErrors();
    //if (empty(this.state.errors)) {
      const { adventureId } = this.props.match.params;
      this.props.gradeManual(adventureId, this.state.addedGrades);
    //}
  }

  handleGradeChange = (grade, points) => {
    const addedGrades = [ ...this.state.addedGrades ];

    const addedGrade = addedGrades.find((g) => g.grade === grade.id);
    addedGrade.points = points; 
    
    this.setState({ addedGrades });
  }

  renderStudentAnswer = (grade) => {
    const addedGradeIndex = this.state.addedGrades.findIndex((g) => g.grade === grade.id)
    return (
      <>
        {empty(grade.studentAnswer.imageAnswer) ?
          <Typography variant='body2'>{grade.studentAnswer.textAnswer.text}</Typography>:
          <img
            alt={grade.studentAnswer.imageAnswer.image}
            src={grade.studentAnswer.imageAnswer.image}
            style={{ height: '200px', width: '200px' }}
            title={grade.studentAnswer.imageAnswer.image}
          />
        }
        <br/>
        <TextField 
          error={get(this.state.errors, `addedGrades[${addedGradeIndex}].points`, false)}
          helperText={get(this.state.errors, `addedGrades[${addedGradeIndex}].points`, '')}
          label='Podaj ocenę:'
          name='points'
          onChange={() => this.handleGradeChange(grade, event.target.value)}
          type='text'
          value={this.state.addedGrades[addedGradeIndex]?.points || ''} 
          variant='standard'
        />
      </>
    )
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
    console.log(this.state);
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <div className={classes.root}>
              <CssBaseline />
              <NavBar logout={this.props.logout} title={this.getAdventureName()} returnLink={'/'} />
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <>
                  {this.state.adventure.pointSource.questions.map((question, i) =>
                  <div key={i} style={{ margin: '10px' }}>
                    {question.grades.length !== 0 &&
                      <>
                        <Typography variant='subtitle1'>{question.text}</Typography>
                        <Typography variant='body1'>Punktacja: {question.pointsPerIncorrectAnswer}-{question.pointsPerCorrectAnswer}</Typography>
                        {question.grades.map((grade, j) =>
                          <React.Fragment key={100+j}>
                            <Typography variant='subtitle2'>{grade.student}:</Typography>
                            {this.renderStudentAnswer(grade)}
                          </React.Fragment>
                        )}
                      </>
                    }
                  </div>
                  )}
                  <div style={{ float: 'right', marginBottom: '10px', marginRight: '5px' }}>
                    <Button
                      color='primary'
                      variant='contained'
                      onClick={this.submitGrades}
                    >Dodaj oceny</Button>
                  </div>
                </>
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
  connect(mapStateToProps, { logout, gradeManual }),
  withStyles(styles),
)(ManualGrading);
