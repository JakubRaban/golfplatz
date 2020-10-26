import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CssBaseline,
  Typography,
  withStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../../actions/auth.js';
import { addAdventure, updateAdventure } from '../../../actions/course.js';
import { toServerForm } from '../../../clientServerTranscoders/adventureTranscoder.js';
import { styles } from '../../../styles/style.js';
import NavBar from '../../common/NavBar.js';
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
        timeLimit: 0,
        timerRulesEnabled: false,
        timerRules: [{ ...this.emptyTimerRule }],
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
    if(this.state.isNew) {
      await this.props.addAdventure(this.state, this.props.chapter.id);
    } else {
      await this.props.updateAdventure(this.state, this.props.location.state.adventure.id);
    }
    this.setState({ isAdded: true });
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
      <div className={classes.root}>
        <CssBaseline/>
        <NavBar logout={this.props.logout}
          title={this.state.isNew ? 'Stwórz nową przygodę' : 'Edytuj przygodę'} returnLink={`/chapters/${this.props.chapter.id}`} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer}/>
          <AdventureBasicDataForm adventure={this.state} updateForm={this.updateBasicData}/>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>Pytania</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdventureQuestionsFormList questions={this.state.questions}
                addQuestion={this.addNewQuestion} updateQuestion={this.updateQuestion}
                deleteQuestion={this.deleteQuestion}
                addAnswer={this.addNewAnswer} updateAnswer={this.updateAnswer}
                deleteAnswer={this.deleteAnswer}/>
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
                    timeLimit={this.state.timeLimit} setTimeLimit={this.setTimeLimit}/>
                </div>
                <div>
                  <TimerRulesFormList timerRules={this.state.timerRules} enableTimerRules={this.enableTimerRules}
                    timerRulesEnabled={this.state.timerRulesEnabled}
                    addTimerRule={this.addTimerRule} updateTimerRule={this.updateTimerRule}
                    deleteTimerRule={this.deleteTimerRule}/>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Button color={'primary'} onClick={this.submitForm}>Zatwierdź i zapisz</Button>
          {this.state.isAddingAdventure && <CircularProgress />}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
  adventures: state.course.adventures,
});

export default compose(
  connect(mapStateToProps, { logout, addAdventure, updateAdventure }),
  withStyles(styles),
)(Adventure);
