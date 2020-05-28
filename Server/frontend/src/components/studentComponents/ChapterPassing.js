import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChapter } from "../../actions/course";
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


export class ChapterPassing extends Component {
  constructor(props) {
    super(props);
    props.startChapter(props.match.params.id);
  }

  state = {
    loading: true,
    submitted: false,
    closedQuestions: [],
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    startedChapter: PropTypes.any,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.startedChapter !== this.props.startedChapter) {
      let tmpClosedQuestions = [];
      let questions = this.props.startedChapter.adventure.pointSource.questions;
      for (var i=0; i<questions.length; i++) {
        if (questions[i].inputType === 'NONE') {
          let answers = [];
          for (var j=0; j<questions[i].answers.length; j++){
            answers.push({id: questions[i].answers[j], marked: false})
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

  submit = (e) => {
    console.log("bbb");

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
              {this.props.startedChapter.adventure.hasTimeLimit ? <div>Wyświetl Timer</div> : <br/>}
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
                <Button variant="contained" onClick={this.submit}>Dalej</Button>
              </div>
              
            </React.Fragment>
              : <div>po submicie</div>
            
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

export default connect(mapStateToProps, {startChapter})(ChapterPassing);

/*import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { countDown: 15 };
    this.timer = setInterval(() => this.tick(), props.timeout || 1000);
  }

  tick() {
    let current = this.state.countDown;
    if (current === 0) {
      this.transition();
    } else {
      this.setState({ countDown: current - 1 });
    }
  }

  transition() {
    clearInterval(this.timer);
    // do something else here, presumably.
  }

  render() {
    return <div className="timer">{this.state.countDown}</div>;
  }
}

render(<App seconds={10} />, document.getElementById("root"));
*/