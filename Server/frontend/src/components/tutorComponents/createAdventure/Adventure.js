import { Accordion, AccordionDetails, AccordionSummary, CssBaseline, Typography, withStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../../actions/auth.js';
import { styles } from '../../../styles/style.js';
import NavBar from '../../common/NavBar.js';
import AdventureBasicDataForm from './AdventureBasicDataForm.js';
import AdventureQuestionsFormList from './AdventureQuestionsFormList.js';

class Adventure extends React.Component {
  emptyAnswer = {
    text: '',
    isCorrect: false,
    isRegex: false,
  }

  emptyQuestion = {
    text: '',
    questionType: 'CLOSED',
    isAutoChecked: true,
    inputType: 'TEXTFIELD',
    pointsPerCorrectAnswer: '1',
    pointsPerIncorrectAnswer: '0',
    messageAfterCorrectAnswer: 'Prawidłowa odpowiedź',
    messageAfterIncorrectAnswer: 'Nieprawidłowa odpowiedź',
    answers: [{ ...this.emptyAnswer }],
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      category: 'QUIZ',
      questions: [{ ...this.emptyQuestion }],
      timeLimit: 0,
      timerRules: [],
    };
  }

  updateBasicData = (data) => {
    this.setState({ ...data });
  }

  addNewQuestion = () => {
    const { questions } = this.state;
    questions.push({ ...this.emptyQuestion });
    this.setState({ questions });
  }

  updateQuestion = (index, questionAttribute) => {
    const { questions } = this.state;
    Object.assign(questions[index], questionAttribute);
    this.setState({ questions });
  }

  deleteQuestion = (index) => {
    const { questions } = this.state;
    questions.splice(index, 1);
    this.setState({ questions });
  }

  addNewAnswer = (questionIndex) => {
    const { questions } = this.state;
    questions[questionIndex].answers.push({ ...this.emptyAnswer });
    this.setState({ questions });
  }

  updateAnswer = (questionIndex, answerIndex, answerAttribute) => {
    const { questions } = this.state;
    Object.assign(questions[questionIndex].answers[answerIndex], answerAttribute);
    this.setState({ questions });
  }

  deleteAnswer = (questionIndex, answerIndex) => {
    const { questions } = this.state;
    questions[questionIndex].answers.splice(answerIndex, 1);
    this.setState({ questions });
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
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Edytuj przygodę'} /* returnLink={`/courses/${this.props.course.id}`} */ />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <AdventureBasicDataForm adventure={this.state} updateForm={this.updateBasicData}/>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>Pytania</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdventureQuestionsFormList questions={this.state.questions}
                addQuestion={this.addNewQuestion} updateQuestion={this.updateQuestion} deleteQuestion={this.deleteQuestion}
                addAnswer={this.addNewAnswer} updateAnswer={this.updateAnswer} deleteAnswer={this.deleteAnswer}/>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>Ograniczenia czasowe</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* <TimeLimitForm />*/}
              {/* <TimerRulesFormList />*/}
            </AccordionDetails>
          </Accordion>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { logout }),
  withStyles(styles),
)(Adventure);
