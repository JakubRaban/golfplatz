import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CssBaseline,
  Typography,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { isEmpty as empty } from 'lodash'
import isEmpty from 'validator/lib/isEmpty.js'
import isInt from 'validator/lib/isInt.js'
import isDecimal from 'validator/lib/isDecimal.js'
import { setWith } from 'lodash'

import { logout } from '../../../actions/auth.js';
import { addAdventure, updateAdventure } from '../../../actions/course.js';
import { styles } from '../../../styles/style.js';
import NavBar from '../../common/navbars/NavBar.js';
import AdventureBasicDataForm from './AdventureBasicDataForm.js';
import AdventureQuestionsFormList from './AdventureQuestionsFormList.js';
import TimeLimitForm from './TimeLimitForm.js';
import TimerRulesFormList from './TimerRulesFormList.js';
import CircularProgress from "@material-ui/core/CircularProgress";

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
  }

  emptyTimerRule = {
    leastPointsAwardedPercent: '',
    ruleEndTime: '',
    decreasingMethod: 'NONE',
  }

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

  constructor(props) {
    super(props);
    // const adventure = this.props.adventures.find((adventure) => adventure.id === this.props.match?.params?.id)
    if (this.props.location?.state?.adventure) {
      this.state = { ...this.props.location.state.adventure };
      this.state.isNew = false;
    } else {
      this.state = {
        name: '',
        taskDescription: '',
        category: 'NOT SELECTED',
        questions: [{ ...this.emptyQuestion }],
        hasTimeLimit: false,
        timeLimit: '0',
        timerRulesEnabled: false,
        timerRules: [{ ...this.emptyTimerRule }],
        errors: {}
      };
      this.state.isNew = true;
      this.state.questions[0].answers = [];
      this.state.questions[0].answers.push({ ...this.emptyAnswer });
    }
    this.state.isAddingAdventure = false;
    this.state.isAdded = false;
  }

  submitForm = async () => {
    this.setState({ isAddingAdventure: true })
    await this.checkFormValid()
    if (empty(this.state.errors)) {
      if (this.state.isNew) {
        await this.props.addAdventure(this.state, this.props.chapter.id);
      } else {
        await this.props.updateAdventure(this.state, this.props.location.state.adventure.id);
      }
      this.setState({isAdded: true});
    } else {
      this.setState({ isAddingAdventure: false })
    }
  }

  checkFormValid = async () => {
    const errors = {}
    if (isEmpty(this.state.name)) errors.name = 'Nazwa przygody nie może być pusta'
    if (isEmpty(this.state.taskDescription)) errors.taskDescription = 'Opis przygody nie może być pusty'
    if (this.state.category === 'NOT SELECTED') errors.category = 'Wybierz kategorię'
    const questions = this.state.questions
    for (let i = 0; i < questions.length; i++) {
      if (isEmpty(questions[i].text)) setWith(errors, `questions[${i}].text`, 'Tekst pytania nie może być pusty', Object)
      if (!isDecimal(questions[i].pointsPerCorrectAnswer.replace(",", "."))) setWith(errors, `questions[${i}].pointsPerCorrectAnswer`, 'Podaj liczbę', Object)
      if (!isDecimal(questions[i].pointsPerIncorrectAnswer.replace(",", "."))) setWith(errors, `questions[${i}].pointsPerIncorrectAnswer`, 'Podaj liczbę', Object)
      for (let j = 0; j < questions[i].answers.length; j++) {
        console.log(questions[i], questions[i].answers, questions[i].answers[j], questions[i].answers[j].text)
        if (questions[i].isAutoChecked && isEmpty(questions[i].answers[j].text)) setWith(errors, `questions[${i}].answers[${j}].text`, 'Tekst odpowiedzi nie może być pusty', Object)
      }
    }
    if (this.state.hasTimeLimit && !isInt(this.state.timeLimit, { min: 1 })) errors.timeLimit = 'Limit czasowy musi być liczbą większą od 0'
    if (this.state.timerRulesEnabled) {
      const timerRules = this.state.timerRules
      for (let i = 0; i < this.state.timerRules.length; i++) {
        if (!isInt(timerRules[i].leastPointsAwardedPercent, { min: 1 })) setWith(errors, `timerRules[${i}].leastPointsAwardedPercent`, 'Podaj liczbę większą od 0', Object)
        if (!isInt(timerRules[i].ruleEndTime, { min: 1 })) setWith(errors, `timerRules[${i}].ruleEndTime`, 'Podaj liczbę większą od 0', Object)
      }
    }
    console.log(errors)

    await this.setState({ errors })
  }

  updateBasicData = (data) => {
    this.setState({ ...data });
  }

  addNewQuestion = () => {
    const { questions } = this.state;
    const newQuestion = { ...this.emptyQuestion };
    newQuestion.answers = [];
    newQuestion.answers.push({ ...this.emptyAnswer });
    questions.push(newQuestion);
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

  setHasTimeLimit = (hasTimeLimit) => {
    this.setState({ hasTimeLimit });
  }

  setTimeLimit = (timeLimit) => {
    this.setState({ timeLimit });
  }

  enableTimerRules = (timerRulesEnabled) => {
    this.setState({ timerRulesEnabled });
  }

  addTimerRule = () => {
    const { timerRules } = this.state;
    timerRules.push({ ...this.emptyTimerRule });
    this.setState({ timerRules });
  }

  updateTimerRule = (ruleIndex, ruleAttribute) => {
    const { timerRules } = this.state;
    Object.assign(timerRules[ruleIndex], ruleAttribute);
    this.setState({ timerRules });
  }

  deleteTimerRule = (ruleIndex) => {
    const { timerRules } = this.state;
    timerRules.splice(ruleIndex, 1);
    this.setState({ timerRules });
  }

  render() {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login"/>;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }
    if (this.state.isAdded) {
      return <Redirect to={`/chapters/${this.props.chapter.id}`} />
    }

    return (
      <ThemeProvider theme={this.theme}>
        <div className={classes.root}>
          <CssBaseline/>
          <NavBar logout={this.props.logout}
            title={this.state.isNew ? 'Stwórz nową przygodę' : 'Edytuj przygodę'} returnLink={`/chapters/${this.props.chapter.id}`} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <AdventureBasicDataForm adventure={this.state} updateForm={this.updateBasicData} errors={this.state.errors}/>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography className={classes.heading}>Pytania</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AdventureQuestionsFormList questions={this.state.questions}
                  addQuestion={this.addNewQuestion} updateQuestion={this.updateQuestion}
                  deleteQuestion={this.deleteQuestion}
                  addAnswer={this.addNewAnswer} updateAnswer={this.updateAnswer}
                  deleteAnswer={this.deleteAnswer}
                  errors={this.state.errors}/>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography className={classes.heading}>Ograniczenia czasowe</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div>
                    <TimeLimitForm hasTimeLimit={this.state.hasTimeLimit} setHasTimeLimit={this.setHasTimeLimit}
                      timeLimit={this.state.timeLimit} setTimeLimit={this.setTimeLimit} errors={this.state.errors}/>
                  </div>
                  <div>
                    <TimerRulesFormList timerRules={this.state.timerRules} enableTimerRules={this.enableTimerRules}
                      timerRulesEnabled={this.state.timerRulesEnabled}
                      addTimerRule={this.addTimerRule} updateTimerRule={this.updateTimerRule}
                      deleteTimerRule={this.deleteTimerRule} errors={this.state.errors}/>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Button color={'primary'} onClick={this.submitForm}>Zatwierdź i zapisz</Button>
            {!empty(this.state.errors) && <div style={{ color: 'red' }}>Formularz zawiera błędy. Popraw je i spróbuj ponownie.</div>}
            {this.state.isAddingAdventure && <CircularProgress />}
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
  adventures: state.course.adventures,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, { logout, addAdventure, updateAdventure }),
  withStyles(styles),
)(Adventure);
