import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChapter, addAdventureAnswer, chooseNextAdventure } from "../../actions/course";
import Typography from '@material-ui/core/Typography';
import { Adventure } from './Adventure';
import { NextAdventureChoice } from './NextAdventureChoice';


export class ChapterPassing extends Component {
  constructor(props) {
    super(props);
    props.startChapter(props.match.params.id);
  }

  state = {
    choiceMode: false,
    answerMode: true,
    summaryMode: false,
    loading: true,
    submitted: false,
    closedQuestions: [],
    timeLimit: 90,
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    adventurePart: PropTypes.any,
  };

  adventureAnswer = {};
  // tick() {
  //   let current = this.state.timeLimit;
  //   if (current === 0) {
  //     this.transition();
  //   } else {
  //     this.setState({ timeLimit: current - 1 });
  //   }
  // }

  // transition() {
  //   clearInterval(this.timer);
  //   //call timeout
  // }


  componentDidUpdate(prevProps) {
    if (prevProps.adventurePart !== this.props.adventurePart) {
      if (this.props.adventurePart.responseType === 'adventure') {
        let tmpClosedQuestions = [];
        let questions = this.props.adventurePart.adventure.pointSource.questions;
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
          answerMode: true,
          choiceMode: false,
        })
        console.log(this.props.adventurePart);
        console.log(tmpClosedQuestions);
        
        this.startTime = new Date();
        // this.timer = setInterval(() => this.tick(), 1000);
      }
      else if (this.props.adventurePart.responseType === 'choice') {
        this.setState({
          choiceMode: true,
          answerMode: false,
          summaryMode: false,
          submitted: false,
          loading: false,
          closedQuestions: [],
        })
      }
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

  onSubmitAnswer = (e) => {
    /*tymczasowo:*/
    let answerTime = 16;
    let closedQuestions = [];
    let openQuestions = [];
    this.state.closedQuestions.map(question => (
      closedQuestions.push({questionId: question.id, markedAnswers: question.givenAnswers.filter(a => a.marked).map(a => a.id)})
    ));
    this.adventureAnswer = {startTime: this.startTime.toISOString(), answerTime: answerTime, closedQuestions: closedQuestions, openQuestions: openQuestions};
    
    this.setState({
      submitted: true,
    })

  };

  onNext = (e) => {
    this.setState({loading: true});
    this.props.addAdventureAnswer(this.props.adventurePart.adventure.id, this.adventureAnswer);
  }

  onSubmitPathChoice = id => (e) => {
    this.setState({loading: true});
    this.props.chooseNextAdventure(id);
  }

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
          <React.Fragment>
            {this.state.answerMode &&
            <Adventure timeLimit={this.state.timeLimit}
                      closedQuestions={this.state.closedQuestions}
                      submitted={this.state.submitted}
                      adventurePart={this.props.adventurePart}
                      onAnswer={this.onAnswerChange}
                      onSubmit={this.onSubmitAnswer}
                      onNext={this.onNext}
                      />
            }
            {this.state.choiceMode &&
            <NextAdventureChoice
                adventurePart={this.props.adventurePart}
                onSubmit={this.onSubmitPathChoice}
                />
            }
          </React.Fragment>
        }
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  adventurePart: state.course.adventurePart,
});

export default connect(mapStateToProps, {startChapter, addAdventureAnswer, chooseNextAdventure})(ChapterPassing);
