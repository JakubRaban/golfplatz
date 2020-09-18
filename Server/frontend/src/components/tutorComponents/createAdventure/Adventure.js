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
  emptyQuestion = {
    text: '',
    questionType: 'CLOSED',
    isAutoChecked: true,
    inputType: 'TEXTFIELD',
    pointsPerCorrectAnswer: '1',
    pointsPerIncorrectAnswer: '0',
    messageAfterCorrectAnswer: 'Prawidłowa odpowiedź',
    messageAfterIncorrectAnswer: 'Nieprawidłowa odpowiedź',
    answers: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      questions: [],
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
    this.setState({ questions }, () => console.log(this.state.questions));
  }

  updateQuestion = (index, question) => {
    const { questions } = this.state;
    questions[index] = question;
    this.setState({ questions }, () => console.log(this.state.questions));
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
          <AdventureBasicDataForm updateForm={this.updateBasicData}/>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>Pytania</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <AdventureQuestionsFormList emptyQuestion={this.emptyQuestion} addQuestion={this.addNewQuestion} updateQuestion={this.updateQuestion}/>
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
