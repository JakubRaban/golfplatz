import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startChapter, addAdventureAnswer, chooseNextAdventure } from "../../actions/course";
import Typography from '@material-ui/core/Typography';
import { Adventure } from './Adventure';
import { NextAdventureChoice } from './NextAdventureChoice';
import { Summary } from './Summary';
import {styles} from "../../styles/style.js";
import compose from 'recompose/compose';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';
import { logout } from '../../actions/auth';
import NavBar from '../common/NavBar';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#42a5f5', //get na szate graficzna kursu w przyszlosci
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
    }
  },
});


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
    closedQuestions: new Map(),
    openQuestions: new Map(),
    timeLimit: 90,
    ended: false,
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    adventurePart: PropTypes.any,
  };

  adventureAnswer = {};
  
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
    if (prevProps.adventurePart !== this.props.adventurePart) {
      if (this.props.adventurePart.responseType === 'adventure') {
        let tmpClosedQuestions = new Map();
        let tmpOpenQuestions = new Map();
        let questions = this.props.adventurePart.adventure.pointSource.questions;
        for (var i=0; i<questions.length; i++) {
          if (questions[i].questionType === 'CLOSED') {
            let answers = [];
            for (var j=0; j<questions[i].answers.length; j++){
              answers.push({id: questions[i].answers[j].id, marked: false})
            }
            tmpClosedQuestions.set(questions[i].id, answers);
          } else {
            tmpOpenQuestions.set(questions[i].id, "");
          }
        }
        this.setState({
          loading: false,
          submitted: false,
          closedQuestions: tmpClosedQuestions,
          openQuestions: tmpOpenQuestions,
        })
        
        this.startTime = new Date();
        if (this.props.adventurePart.adventure.hasTimeLimit) {
          this.timer = setInterval(() => this.tick(), 1000);
        }
      }
      else if (this.props.adventurePart.responseType === 'choice') {
        this.setState({
          choiceMode: true,
          answerMode: false,
          summaryMode: false,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
        })
      }
      else if (this.props.adventurePart.responseType === 'summary') {
        this.setState({
          choiceMode: false,
          answerMode: false,
          summaryMode: true,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
        })
      }
    }
  }

  onOpenAnswerChange = (id) => (e) => {
    let tmpQuestions = this.state.openQuestions;
    tmpQuestions.set(id, e.target.value);

    this.setState({
      openQuestions: tmpQuestions,
    })
  }

  onAnswerChange = (id, j, i) => (e)  => {
    let tmpQuestions = this.state.closedQuestions;
    if (!this.props.adventurePart.adventure.pointSource.questions[i].isMultipleChoice)
      tmpQuestions.get(id).map(x => x.marked = false);
   
    tmpQuestions.get(id)[j].marked = e.target.checked;
    this.setState({
      closedQuestions: tmpQuestions,
    })
  };

  onSubmitAnswer = (e) => {
    /*tymczasowo:*/
    let answerTime = 16;

    let closedQuestions = [];
    let openQuestions = [];
    
    this.state.closedQuestions.forEach((value, key) => 
      closedQuestions.push({questionId: key, markedAnswers: value.filter(a => a.marked).map(a => a.id)})
    );
    this.state.openQuestions.forEach((value, key) => 
      openQuestions.push({questionId: key, givenAnswer: value})
    );
    this.adventureAnswer = {startTime: this.startTime.toISOString(), answerTime: answerTime, closedQuestions: closedQuestions, openQuestions: openQuestions};
    console.log(this.adventureAnswer);

    this.setState({
      submitted: true,
    })

  };

  onNext = (e) => {
    this.setState({loading: true});
    this.props.addAdventureAnswer(this.props.adventurePart.adventure.id, this.adventureAnswer);
  }

  onSubmitPathChoice = id => (e) => {
    this.setState({loading: true, answerMode: true, choiceMode: false});
    this.props.chooseNextAdventure(id);
  }

  endChapter = (e) => {
    this.setState({
      ended: true,
    })
  }

  render() {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      )
    }
    if (this.state.ended) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Przed Tobą walka'} returnLink={'/'} />
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
          <div style={{margin: '5px'}}>
          {this.state.loading ? <div>Ładowanie</div> : 
            <React.Fragment>
              <Typography variant="h4" gutterBottom>
                {this.props.adventurePart.chapterName} 
              </Typography>
              {this.state.answerMode &&
              <Adventure timeLimit={this.state.timeLimit}
                  closedQuestions={this.state.closedQuestions}
                  openQuestions={this.state.openQuestions}
                  submitted={this.state.submitted}
                  adventurePart={this.props.adventurePart}
                  onAnswerChange={this.onAnswerChange}
                  onOpenAnswerChange={this.onOpenAnswerChange}
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
              {this.state.summaryMode &&
              <Summary
                  adventurePart={this.props.adventurePart}
                  endChapter={this.endChapter}
                  />
              }
            </React.Fragment>
          }
          </div>
        </main>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  adventurePart: state.course.adventurePart,
});

export default compose(
  connect(mapStateToProps, {startChapter, addAdventureAnswer, chooseNextAdventure, logout}),
  withStyles(styles)
)(ChapterPassing);
