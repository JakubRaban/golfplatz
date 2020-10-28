import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { addAdventureAnswer, chooseNextAdventure, startChapter, getAchievementsAfterChapter } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/NavBar.js';
import { Adventure } from './Adventure.js';
import { NextAdventureChoice } from './NextAdventureChoice.js';
import { Summary } from './Summary.js';

export class ChapterPassing extends Component {
  adventureAnswer = {};

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

  componentDidUpdate(prevProps) {
    if (prevProps.adventurePart !== this.props.adventurePart) {
      if (this.props.adventurePart.responseType === 'adventure') {
        const tmpClosedQuestions = new Map();
        const tmpOpenQuestions = new Map();
        const { questions } = this.props.adventurePart.adventure.pointSource;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].questionType === 'CLOSED') {
            const answers = [];
            for (let j = 0; j < questions[i].answers.length; j++) {
              answers.push({ id: questions[i].answers[j].id, marked: false });
            }
            tmpClosedQuestions.set(questions[i].id, answers);
          } else {
            tmpOpenQuestions.set(questions[i].id, '');
          }
        }
        this.setState({
          loading: false,
          submitted: false,
          closedQuestions: tmpClosedQuestions,
          openQuestions: tmpOpenQuestions,
        });

        this.startTime = new Date();
        if (this.props.adventurePart.adventure.timeLimit > 0) {
          this.timer = setInterval(() => this.tick(), 1000);
        }
      } else if (this.props.adventurePart.responseType === 'choice') {
        this.setState({
          choiceMode: true,
          answerMode: false,
          summaryMode: false,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
        });
      } else if (this.props.adventurePart.responseType === 'summary') {
        this.props.getAchievementsAfterChapter(this.props.match.params.id);
        this.setState({
          choiceMode: false,
          answerMode: false,
          summaryMode: true,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
        });
      }
    }
  }

  tick() {
    const current = this.state.timeLimit;
    if (current === 0) {
      this.transition();
    } else {
      this.setState({ timeLimit: current - 1 });
    }
  }

  transition() {
    clearInterval(this.timer);
    // call timeout
  }

  onOpenAnswerChange = (id) => (e) => {
    const tmpQuestions = this.state.openQuestions;
    tmpQuestions.set(id, e.target.value);

    this.setState({
      openQuestions: tmpQuestions,
    });
  }

  onAnswerChange = (id, j, i) => (e) => {
    const tmpQuestions = this.state.closedQuestions;
    if (!this.props.adventurePart.adventure.pointSource.questions[i].isMultipleChoice) tmpQuestions.get(id).map((x) => x.marked = false);

    tmpQuestions.get(id)[j].marked = e.target.checked;
    this.setState({
      closedQuestions: tmpQuestions,
    });
  };

  onSubmitAnswer = (e) => {
    const answerTime = 16; /* tymczasowo:*/

    const closedQuestions = [];
    const openQuestions = [];

    this.state.closedQuestions.forEach((value, key) =>
      closedQuestions.push({ questionId: key, markedAnswers: value.filter((a) => a.marked).map((a) => a.id) }),
    );
    this.state.openQuestions.forEach((value, key) =>
      openQuestions.push({ questionId: key, givenAnswer: value }),
    );
    this.adventureAnswer = { startTime: this.startTime.toISOString(), answerTime, closedQuestions, openQuestions };
    console.log(this.adventureAnswer);

    this.setState({
      submitted: true,
    });
  };

  onNext = (e) => {
    this.setState({ loading: true });
    this.props.addAdventureAnswer(this.props.adventurePart.adventure.id, this.adventureAnswer);
  }

  onSubmitPathChoice = (id) => (e) => {
    this.setState({ loading: true, answerMode: true, choiceMode: false });
    this.props.chooseNextAdventure(id);
  }

  endChapter = (e) => {
    this.setState({
      ended: true,
    });
  }

  render() {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      );
    }
    if (this.state.ended) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Przed Tobą walka'} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div style={{ margin: '5px' }}>
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
                    achievements={this.props.achievements}
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
  achievements: state.course.achievements,
});

export default compose(
  connect(mapStateToProps, { startChapter, addAdventureAnswer, chooseNextAdventure, logout, getAchievementsAfterChapter }),
  withStyles(styles),
)(ChapterPassing);
