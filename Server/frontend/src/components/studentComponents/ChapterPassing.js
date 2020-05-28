import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChapter, addAdventureAnswer } from "../../actions/course";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


class Timer extends React.Component {
  format(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
    seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
    return minutes + ':' + seconds;
  }
  render () {
    const {time} = this.props;
    return (
      <div>
        <h1>{this.format(time)}</h1>
      </div>
    )
  }
}

export class ChapterPassing extends Component {
  constructor(props) {
    super(props);
    props.startChapter(props.match.params.id);
  }

  state = {
    loading: true,
    submitted: false,
    closedQuestions: [],
    timeLimit: 90,
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    startedChapter: PropTypes.any,
  };

  tick() {
    let current = this.state.timeLimit;
    if (current === 0) {
      this.transition();
    } else {
      this.setState({ timeLimit: current - 1 });
    }
  }

  transition() {
    clearInterval(this.timer);
    //call timeout
  }


  componentDidUpdate(prevProps) {
    if (prevProps.startedChapter !== this.props.startedChapter) {
      let tmpClosedQuestions = [];
      let questions = this.props.startedChapter.adventure.pointSource.questions;
      for (var i=0; i<questions.length; i++) {
        if (questions[i].questionType === 'CLOSED') {
          let answers = [];
          for (var j=0; j<questions[i].answers.length; j++){
            answers.push({id: questions[i].answers[j].id, marked: false})
          }
          tmpClosedQuestions.push({id: questions[i].id, givenAnswers: answers})
        } else {
          //tmpQuestions.push()
        }
      }
      this.setState({
        loading: false,
        closedQuestions: tmpClosedQuestions,
      })
      console.log(this.props.startedChapter);
      console.log(tmpClosedQuestions);
      
      this.startTime = new Date();
      this.timer = setInterval(() => this.tick(), 1000);
    }
  }

  onAnswerChange = (i, j) => (e)  => {
    let tmpQuestions = this.state.closedQuestions;
    tmpQuestions[i].givenAnswers[j].marked = e.target.checked;
    console.log(tmpQuestions);
    this.setState({
      closedQuestions: tmpQuestions,
    })
  };

  onSubmit = (e) => {
    /*tymczasowo:*/
    let answerTime = 16;
    let closedQuestions = [];
    let openQuestions = [];
    this.state.closedQuestions.map(question => (
      closedQuestions.push({questionId: question.id, markedAnswers: question.givenAnswers.filter(a => a.marked).map(a => a.id)})
    ));
    let adventureAnswer = {startTime: this.startTime.toISOString(), answerTime: answerTime, closedQuestions: closedQuestions, openQuestions: openQuestions};
    
    this.props.addAdventureAnswer(this.props.startedChapter.adventure.id, adventureAnswer);
    
    this.setState({
      submitted: true,
    })
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div>
        {/* tu byłaby fajna nazwa rozdziału */}
        <Typography variant="h4" gutterBottom>
          Przed Tobą walka 
        </Typography>
        {this.state.loading ? <div>Ładowanie</div> : 
          <div>
            <Typography variant="h5" gutterBottom>
              {this.props.startedChapter.adventure.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {this.props.startedChapter.adventure.taskDescription}
            </Typography>
            {!this.state.submitted ? 
            <React.Fragment>
              {!this.props.startedChapter.adventure.hasTimeLimit && <Timer time={this.state.timeLimit}/>}
              {this.props.startedChapter.adventure.pointSource.questions.map((question, i) => (
                <React.Fragment>
                  <Typography variant="subtitle1" gutterBottom>
                    {question.text}
                  </Typography>
                  <FormControl component="fieldset">
                    <FormGroup>
                      {question.answers.map((answer, j) => (
                        <FormControlLabel
                          control={<Checkbox checked={this.state.closedQuestions[i].givenAnswers[j].marked}
                          onChange={this.onAnswerChange(i, j)} name="answer" />}
                          label={answer.text}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </React.Fragment>
              ))}
              <div style={{display: 'block'}}>
                <Button variant="contained" onClick={this.onSubmit}>Zatwierdź</Button>
              </div>
              
            </React.Fragment>
              : 
              <React.Fragment>
              {this.props.startedChapter.adventure.pointSource.questions.map((question, i) => (
                <React.Fragment>
                  <Typography variant="subtitle1" gutterBottom>
                    {question.text}
                  </Typography>
                  <FormControl component="fieldset">
                    <FormGroup>
                      {question.answers.map((answer, j) => (
                      <React.Fragment>
                        <FormControlLabel
                          control={<Checkbox checked={this.state.closedQuestions[i].givenAnswers[j].marked}
                          name="answer" />}
                          label={answer.text}
                        />
                        {this.state.closedQuestions[i].givenAnswers[j].marked &&
                          <Typography variant="subtitle2" gutterBottom>
                            {answer.isCorrect ? question.messageAfterCorrectAnswer : question.messageAfterIncorrectAnswer}
                          </Typography> 
                        }
                      </React.Fragment>
                      ))}
                    </FormGroup>
                  </FormControl>
                </React.Fragment>
              ))}
              <div style={{display: 'block'}}>
                <Typography variant="subtitle1" gutterBottom>
                  Twój wynik to: przeliczyć xD
                </Typography>
              </div>
              <div style={{display: 'block'}}>
                <Button variant="contained" onClick={this.onSubmit}>Dalej</Button>
              </div>
              
            </React.Fragment>
            }
          </div>
        }
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  startedChapter: state.course.chapterTaken,
});

export default connect(mapStateToProps, {startChapter, addAdventureAnswer})(ChapterPassing);
