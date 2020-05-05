import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getChapter, addAdventures } from "../../actions/course";
import { Form, Text, NestedForm } from "react-form";


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
          <label htmlFor={`nested-questions-type-${i}`}>Typ pytania:</label>
          <Text field="questionType" id={`nested-questions-message-type-${i}`} />
          {/* jeszcze odp */}
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
          <h5>Pytania</h5>
          <label htmlFor={`nested-timer-rule-${i}`}>Czas obowiązywania reguły:</label>
          <Text field="ruleEndTime" id={`nested-timer-rule-${i}`} />

          <label htmlFor={`nested-timer-pts-awarded-${i}`}>??:</label>
          <Text field="leastPointsAwardedPercent" id={`nested-timer-pts-awarded-${i}`} />
          
          {/* jeszcze method */}
        </div>
      )}
    </Form>
  </NestedForm>
);


export class Chapter extends Component {  
  state = {
    name: "",
    taskDescription: "",
    category: "QUIZ",
    isInitial: false,
    hasTimeLimit: false,
    questions: [],
    timerRules: [],
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    chapter: PropTypes.any,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  componentDidMount() {
    this.props.getChapter(this.props.match.params.id);
  }

  onSubmit = (e) => {
    e.preventDefault();
    const adventure = [];
    adventure.push(this.state);
    this.props.addAdventures(adventure, this.props.chapter.id);
    this.setState({
      name: "",
      taskDescription: "",
      category: "QUIZ",
      isInitial: false,
      hasTimeLimit: false,
      questions: [],
      timerRules,
    });  
  };

  render() {
    const { name, taskDescription } = this.state;

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
          <label>Opis:</label>
          <input type="text" name="taskDescription" onChange={this.onChange} value={taskDescription}/>
          <label>Kategoria:</label>
          <select name="category" onChange={this.onChange}>
            <option value="QUIZ">Quiz</option>
            <option value="SURPRISE">Zadanie niespodzianka</option>
            <option value="GENERIC">Zadanie na zajęcia</option>
            <option value="ACTIVENESS">Aktywność</option>
            <option value="TEST">Kolokwium</option>
            <option value="HOMEWORK">Zadanie domowe</option>
          </select>    
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
                      </div>
                    ), this.state.questions = formApi.values.questions)}
                  <button
                    onClick={() =>
                      formApi.addValue("questions", {
                        text: "",
                        pointsPerCorrectAnswer: "",
                        pointsPerIncorrectAnswer: "",
                        messageAfterCorrectAnswer: "",
                        messageAfterIncorrectAnswer: "",
                      })}
                    type="button">Dodaj kolejne pytanie
                  </button>
                </form>
                <form onSubmit={formApi.submitForm} id="timer-rules">
                {formApi.values.timerRules &&
                  formApi.values.timerRules.map((f, i) => (
                    <div key={i}>
                      <TimerRule i={i} />
                    </div>
                    
                  ), this.state.timerRules = formApi.values.timerRules)}
                <button
                  onClick={() =>
                    formApi.addValue("timerRules", {
                      leastPointsAwardedPercent: "",
                      ruleEndTime: "",
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
