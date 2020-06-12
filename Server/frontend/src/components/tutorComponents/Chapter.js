import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getChapter, addAdventures } from "../../actions/course";
import { Form, Text, NestedForm } from "react-form";
import Popup from "reactjs-popup";
import { withStyles } from '@material-ui/core/styles';
import {styles} from "../../styles/style.js";
import compose from 'recompose/compose';
import { logout } from '../../actions/auth';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import "../../styles/course-forms.css";


const Answers = ({ i }) => (
  <NestedForm field={["answers", i]} key={`nested-answers-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h5>Możliwe warianty odpowiedzi:</h5>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-answers-${i}`}>Odp:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="text" id={`nested-answers-${i}`} />
            </div>
          </div>
        </div>
      )}
    </Form>
  </NestedForm>
);

const Questions = ({ i }) => (
  <NestedForm field={["questions", i]} key={`nested-questions-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h5>Pytania</h5>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-questions-name-${i}`}>Treść pytania:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="text" id={`nested-questions-name-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-questions-correct-${i}`}>Ilość punktów za poprawną odpowiedź:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="pointsPerCorrectAnswer" id={`nested-questions-correct-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-questions-incorrect-${i}`}>Ilość punktów za niepoprawną odpowiedź:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="pointsPerIncorrectAnswer" id={`nested-questions-cat-${i}`} />   
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-questions-message-correct-${i}`}>Wiadomość po udzieleniu poprawnej odpowiedzi:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="messageAfterCorrectAnswer" id={`nested-questions-message-correct-${i}`} />  
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-questions-message-incorrect-${i}`}>Wiadomość po udzieleniu niepoprawnej odpowiedzi:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="messageAfterInCorrectAnswer" id={`nested-questions-message-incorrect-${i}`} />  
            </div>
          </div>
        </div>
      )}
    </Form>
  </NestedForm>
);

const TimerRule = ({ i }) => (
  <NestedForm field={["timer-rules", i]} key={`nested-timer-rules-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h5>Reguły czasowe</h5>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-timer-rule-${i}`}>Czas obowiązywania reguły:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="ruleEndTime" id={`nested-timer-rule-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-timer-rule-${i}`}>Czas obowiązywania reguły:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="ruleEndTime" id={`nested-timer-rule-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-timer-pts-awarded-${i}`}>??:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="leastPointsAwardedPercent" id={`nested-timer-pts-awarded-${i}`} />
            </div>
          </div>          
        </div>
      )}
    </Form>
  </NestedForm>
);


export class Chapter extends Component {  
  state = {
    internalId: "",
    name: "",
    taskDescription: "",
    pointSource: { category: "QUIZ", questions: [], surpriseExercise:[] },
    isInitial: false,
    hasTimeLimit: false,
    timerRules: [],
    nextAdventures: [],
    popUpOpen: false,
  };  

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    chapter: PropTypes.any,
  };

  surpriseExercise = {earliestPossibleSendTime: "", latestPossibleSendTime: "", sendingMethod: "PHONE"};

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onCategoryChange = (e)  => {
    if (e.target.value === "SURPRISE") {
      this.setState({popUpOpen: true});
    } else {
      this.state.pointSource.surpriseExercise = [];
    }
    this.state.pointSource.category = e.target.value;
  };

  onQuestionChange = i => (e)  => {
    this.state.pointSource.questions[i].questionType = e.target.value;
  };

  onTimerChange = i => (e)  => {
    this.state.timerRules[i].decreasingMethod = e.target.value;
  };

  onCorrectChange = (i, j) => (e)  => {
    this.state.pointSource.questions[i].answers[j].isCorrect = e.target.value === on ? true : false;
  };

  onRegexChange = (i, j) => (e)  => {
    this.state.pointSource.questions[i].answers[j].isRegex = e.target.value === on ? true : false;
  };

  onEarliestChange = (e) => {
    this.surpriseExercise.earliestPossibleSendTime = e.target.value;
  }

  onLatestChange = (e) => {
    this.surpriseExercise.latestPossibleSendTime = e.target.value;
  }

  onSendingChange = (e) => {
    this.surpriseExercise.sendingMethod = e.target.value;
  }

  componentDidMount() {
    this.props.getChapter(this.props.match.params.id);
  }

  updateSurpriseExercise(){
    this.state.pointSource.surpriseExercise = this.surpriseExercise;
    this.setState({popUpOpen: false});
  }

  onSubmit = (e) => {
    e.preventDefault();
    const adventure = [];
    adventure.push(this.state);
    this.props.addAdventures(adventure, this.props.chapter.id);
    this.setState({
      internalId: "",
      name: "",
      taskDescription: "",
      pointSource: { category: "QUIZ", questions: [], surpriseExercise:[] },
      isInitial: false,
      hasTimeLimit: false,
      timerRules: [],
      nextAdventures: [],
    });  
  };

  render() {
    const { name, taskDescription, internalId } = this.state;
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, false && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton component={Link} to="/"
            edge="start"
            color="inherit"
            aria-label="Powrót"
            className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Szczegóły kursu
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={this.props.logout.bind(this)}>
            <Badge color="secondary">
              <PowerSettingsNewIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div style={{margin: "10px", display: 'block'}}>
          <h3>Oglądasz szczegóły rozdziału "{this.props.chapter.name}"</h3>
          <h4>Tu będą przygody</h4>
          <h4>Dodaj przygody! - tu będzie button</h4>


          <form onSubmit={this.onSubmit}>
            <h3>Przygoda</h3>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Nazwa:</label>
              </div>
              <div className="col-75">
                <input type="text" name="name" onChange={this.onChange} value={name}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Numer przygody w rozdziale:</label>
              </div>
              <div className="col-75">
                <input type="number" name="internalId" onChange={this.onChange} value={internalId}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Opis:</label>
              </div>
              <div className="col-75">
                <input type="text" name="taskDescription" onChange={this.onChange} value={taskDescription}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Kategoria:</label>
              </div>
              <div className="col-75">
                <select name="category" onChange={this.onCategoryChange}>
                  <option value="QUIZ">Quiz</option>
                  <option value="SURPRISE">Zadanie niespodzianka</option>
                  <option value="GENERIC">Zadanie na zajęcia</option>
                  <option value="ACTIVENESS">Aktywność</option>
                  <option value="TEST">Kolokwium</option>
                  <option value="HOMEWORK">Zadanie domowe</option>
                </select>
                <Popup open={this.state.popUpOpen} position="right center">
                  {close => (  
                      <div>
                        <form>
                          <h6>Określ zakres czasowy i sposób wysłania wiadomości</h6>
                          <label>Najwcześniej:</label>
                          <input type="text" name="earliestPossibleSendTime" onChange={this.onEarliestChange}/>
                          <label>Najpóźniej:</label>
                          <input type="text" name="latestPossibleSendTime" onChange={this.onLatestChange}/>
                          <label>Metoda wysłania:</label>
                          <select name="sendingMethod" onChange={this.onSendingChange}>
                            <option value="PHONE">SMS</option>
                            <option value="EMAIL">Mail</option>
                          </select>
                        </form>
                        <button type="button" onClick={() => {
                          this.updateSurpriseExercise();
                          close();
                        }}>Dalej</button>
                      </div>
                  )}
                </Popup> 
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Pierwsza przygoda w rozdziale:</label>
              </div>
              <div className="col-75">
                <input type="checkbox" name="isInitial" onChange={this.onChange}></input>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Ma limit czasowy:</label>
              </div>
              <div className="col-75">
                <input type="checkbox" name="hasTimeLimit" onChange={this.onChange}></input>
              </div>
            </div>
            <div>               
              <Form onSubmit={this.onSubmit}>
                {formApi => (
                  <div>
                    <form onSubmit={formApi.submitForm} id="question-form">
                      {formApi.values.questions &&
                        formApi.values.questions.map((f, i) => (
                          <div key={i}>
                            <Questions i={i} />
                            <div className="row">
                              <div className="col-25">
                                <label className="label-class">Typ pytania:</label>
                              </div>
                              <div className="col-75">
                                <select name="nested-questions-type" onChange={this.onQuestionChange(i)}>
                                  <option value="TEXT_AREA">Krótka odpowiedź</option>
                                  <option value="TEXT_FIELD">Krótka odpowiedź</option>
                                  <option value="NONE">Zamknięte</option>
                                </select>
                              </div>
                            </div>
                          <Form onSubmit={this.onSubmit}>
                            {formApi => (
                              <form onSubmit={formApi.submitForm} id="answers">
                                {formApi.values.answers &&
                                  formApi.values.answers.map((f, j) => (
                                    <div key={j} style={{display: 'inline-block', verticalAlign: 'top'}}>
                                      <Answers i={j} />
                                      <div className="row">
                                        <div className="col-25">
                                          <label className="label-class">Poprawna:</label>
                                        </div>
                                        <div className="col-75">
                                          <input type="checkbox" name="isCorrect" onChange={this.onCorrectChange(i,j)}></input>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-25">
                                          <label className="label-class">Sprawdzana wyrażeniem regularnym:</label>
                                        </div>
                                        <div className="col-75">
                                          <input type="checkbox" name="isRegex" onChange={this.onRegexChange(i,j)}></input>
                                        </div>
                                      </div>
                                    </div>
                                  ), this.state.pointSource.questions[i].answers = formApi.values.answers)}
                                <button
                                  onClick={() =>
                                    formApi.addValue("answers", {
                                      text: "",
                                      isCorrect: false,
                                      isRegex: false,
                                    })}
                                  type="button">Dodaj możliwe odpowiedzi</button>
                              </form>
                            )}
                          </Form>   
                        </div>
                      ), this.state.pointSource.questions = formApi.values.questions)}
                    <button
                      onClick={() =>
                        formApi.addValue("questions", {
                          text: "",
                          pointsPerCorrectAnswer: 1.0,
                          pointsPerIncorrectAnswer: 0.0,
                          messageAfterCorrectAnswer: "",
                          messageAfterIncorrectAnswer: "",
                          questionType: "OPEN",
                          answers: [],
                        })}
                      type="button">Dodaj kolejne pytanie
                    </button>
                  </form>
                  <form onSubmit={formApi.submitForm} id="timer-rules">
                  {formApi.values.timerRules &&
                    formApi.values.timerRules.map((f, i) => (
                      <div key={i}>
                        <TimerRule i={i} />
                        <div className="row">
                          <div className="col-25">
                            <label className="label-class">Zmiana punktacji wraz z czasem:</label>
                          </div>
                          <div className="col-75">
                            <select name="nested-timer-method" onChange={this.onTimerChange(i)}>
                              <option value="NONE">Brak</option>
                              <option value="LIN">Liniowo</option>
                            </select>    
                          </div>
                        </div>
                      </div>
                      
                    ), this.state.timerRules = formApi.values.timerRules)}
                  <button
                    onClick={() =>
                      formApi.addValue("timerRules", {
                        leastPointsAwardedPercent: "",
                        ruleEndTime: "",
                        decreasingMethod: "NONE",
                      })}
                    type="button">Dodaj reguły czasowe</button>

                  </form>
                </div>
              )}
            </Form>
            </div>
            <button type="submit">
              Dodaj
            </button> 
          </form>
        </div>
      </main>
    </div>                    
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
});

export default compose(
  connect(mapStateToProps, {getChapter, addAdventures, logout}),
  withStyles(styles)
)(Chapter);
