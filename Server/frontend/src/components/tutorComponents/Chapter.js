import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getChapter, addAdventures } from "../../actions/course";
import { Form, Text, NestedForm } from "react-form";
import Popup from "reactjs-popup";


const Answers = ({ i }) => (
  <NestedForm field={["answers", i]} key={`nested-answers-${i}`}>
    <Form>
      {formApi => (
        <div>
          <h5>Możliwe warianty odpowiedzi:</h5>
          <label htmlFor={`nested-answers-${i}`}>Odp:</label>
          <Text field="text" id={`nested-answers-${i}`} />
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
          <label htmlFor={`nested-questions-name-${i}`}>Treść pytania:</label>
          <Text field="text" id={`nested-questions-name-${i}`} />
          <label htmlFor={`nested-questions-correct-${i}`}>Ilość punktów za poprawną odpowiedź:</label>
          <Text field="pointsPerCorrectAnswer" id={`nested-questions-correct-${i}`} />
          <label htmlFor={`nested-questions-incorrect-${i}`}>Ilość punktów za niepoprawną odpowiedź:</label>
          <Text field="pointsPerIncorrectAnswer" id={`nested-questions-cat-${i}`} />   
          <label htmlFor={`nested-questions-message-correct-${i}`}>Wiadomość po udzieleniu poprawnej odpowiedzi:</label>
          <Text field="messageAfterCorrectAnswer" id={`nested-questions-message-correct-${i}`} />
          <label htmlFor={`nested-questions-message-incorrect-${i}`}>Wiadomość po udzieleniu niepoprawnej odpowiedzi:</label>
          <Text field="messageAfterInCorrectAnswer" id={`nested-questions-message-incorrect-${i}`} />  
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
          <label htmlFor={`nested-timer-rule-${i}`}>Czas obowiązywania reguły:</label>
          <Text field="ruleEndTime" id={`nested-timer-rule-${i}`} />
          <label htmlFor={`nested-timer-pts-awarded-${i}`}>??:</label>
          <Text field="leastPointsAwardedPercent" id={`nested-timer-pts-awarded-${i}`} />
          
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
    // if (!this.props.isAuthenticated) {
    //   return <Redirect to="/login" />;
    // }
    // if (this.props.user.groups[0] === 1) {
    //   return (
    //     <Redirect to="/"/>
    //   )
    // }
    return (
      <div>
        <h3>Oglądasz szczegóły rozdziału "{this.props.chapter.name}"</h3>
        <h4>Dodaj przygody!</h4>

        <form onSubmit={this.onSubmit}>
          <h3>Przygoda</h3>
          <label>Nazwa</label>
          <input type="text" name="name" onChange={this.onChange} value={name}/>
          <label>Numer przygody w rozdziale</label>
          <input type="number" name="internalId" onChange={this.onChange} value={internalId}/>
          <label>Opis:</label>
          <input type="text" name="taskDescription" onChange={this.onChange} value={taskDescription}/>
          <label>Kategoria:</label>
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
          <label>Pierwsza przygoda w rozdziale:</label>
          <input type="checkbox" name="isInitial" onChange={this.onChange}></input>
          <label>Ma limit czasowy:</label>
          <input type="checkbox" name="hasTimeLimit" onChange={this.onChange}></input>
          <Form onSubmit={this.onSubmit}>
            {formApi => (
              <div>
                <form onSubmit={formApi.submitForm} id="question-form">
                  {formApi.values.questions &&
                    formApi.values.questions.map((f, i) => (
                      <div key={i}>
                        <Questions i={i} />
                        <label htmlFor={`nested-questions-type-${i}`}>Typ pytania:</label>  
                        <select name="nested-questions-type" onChange={this.onQuestionChange(i)}>
                          <option value="OPEN">Otwarte</option>
                          <option value="CLOSED">Zamknięte</option>
                        </select>
                        <Form onSubmit={this.onSubmit}>
                          {formApi => (
                            <form onSubmit={formApi.submitForm} id="answers">
                              {formApi.values.answers &&
                                formApi.values.answers.map((f, j) => (
                                  <div key={j}>
                                    <Answers i={j} />
                                    <label>Poprawna:</label>
                                    <input type="checkbox" name="isCorrect" onChange={this.onCorrectChange(i,j)}></input>
                                    <label>Sprawdzana wyrażeniem regularnym:</label>
                                    <input type="checkbox" name="isRegex" onChange={this.onRegexChange(i,j)}></input>
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
                      <label htmlFor={`nested-timer-method-${i}`}>Zmiana punktacji wraz z czasem:</label>  
                        <select name="nested-timer-method" onChange={this.onTimerChange(i)}>
                          <option value="NONE">Brak</option>
                          <option value="LIN">Liniowo</option>
                        </select>
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

          <button type="submit">
            Dodaj
          </button> 
        </form>
        <NavLink to = "/">Powrót</NavLink>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  chapter: state.course.chapterDetailed,
});

export default connect(mapStateToProps, {getChapter, addAdventures})(Chapter);
