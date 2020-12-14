import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { logout } from '../../actions/auth.js';
import { addAdventureAnswer, chooseNextAdventure, startChapter,
  getAchievementsAfterChapter, getRankAfterChapter } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';
import { Adventure } from './Adventure.js';
import { NextAdventureChoice } from './NextAdventureChoice.js';
import { Summary } from './Summary.js';

export class ChapterPassing extends Component {
  adventureAnswer = {
    startTime: new Date().toISOString(),
    answerTime: 0,
    closedQuestions: [],
    openQuestions: [],
    imageQuestions: [],
  };;

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
    imageQuestions: new Map(),
    timeLimit: null,
    ended: false,
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    adventurePart: PropTypes.any,
  };

  theme = createMuiTheme({
    palette: {
      primary: {
        main: this.props.themeColors[0],
      },
      secondary: {
        main: this.props.themeColors[1],
      },
    },
  });

  componentDidUpdate(prevProps) {
    if (prevProps.adventurePart !== this.props.adventurePart) {
      if (this.props.adventurePart.responseType === 'adventure') {
        const tmpClosedQuestions = new Map();
        const tmpOpenQuestions = new Map();
        const tmpImgQuestions = new Map();
        const { questions } = this.props.adventurePart.adventure.pointSource;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].questionType === 'CLOSED') {
            const answers = [];
            for (let j = 0; j < questions[i].answers.length; j++) {
              answers.push({ id: questions[i].answers[j].id, marked: false });
            }
            tmpClosedQuestions.set(questions[i].id, answers);
          } else {
            if (questions[i].inputType === 'IMAGE'){
              tmpImgQuestions.set(questions[i].id, '');
            } else {
              tmpOpenQuestions.set(questions[i].id, '');
            }
          }
        }
        this.setState({
          loading: false,
          submitted: false,
          closedQuestions: tmpClosedQuestions,
          openQuestions: tmpOpenQuestions,
          imageQuestions: tmpImgQuestions,
          timeLimit: this.props.adventurePart.adventure.timeLimit,
        });

        this.startTime = new Date();
      } else if (this.props.adventurePart.responseType === 'choice') {
        this.setState({
          choiceMode: true,
          answerMode: false,
          summaryMode: false,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
          imageQuestions: new Map(),
          timeLimit: null,
        });
      } else if (this.props.adventurePart.responseType === 'summary') {
        this.props.getAchievementsAfterChapter(this.props.match.params.id);
        this.props.getRankAfterChapter(this.props.match.params.id);
        this.setState({
          choiceMode: false,
          answerMode: false,
          summaryMode: true,
          submitted: false,
          loading: false,
          closedQuestions: new Map(),
          openQuestions: new Map(),
          imageQuestions: new Map(),
          timeLimit: null,
        });
      }
    }
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
    if (!this.props.adventurePart.adventure.pointSource.questions[i].isMultipleChoice)
      tmpQuestions.get(id).map((x) => x.marked = false);

    tmpQuestions.get(id)[j].marked = e.target.checked;
    this.setState({
      closedQuestions: tmpQuestions,
    });
  };

  onImageAnswerChange = (id, result) => {
    const tmpQuestions = this.state.imageQuestions;
    tmpQuestions.set(id, result);

    this.setState({
      imageQuestions: tmpQuestions,
    });
  }

  onSubmitAnswer = (timeElapsed) => {
    const answerTime = this.props.adventurePart.adventure.timeLimit ? this.state.timeLimit - timeElapsed/1000 : timeElapsed/1000;

    const closedQuestions = [];
    const openQuestions = [];
    const imageQuestions = [];

    this.state.closedQuestions.forEach((value, key) =>
      closedQuestions.push({ questionId: key, markedAnswers: value.filter((a) => a.marked).map((a) => a.id) }),
    );
    this.state.openQuestions.forEach((value, key) =>
      openQuestions.push({ questionId: key, givenAnswer: value }),
    );
    this.state.imageQuestions.forEach((value, key) => {
      imageQuestions.push({ questionId: key, image: value})
    })

    this.adventureAnswer = {
      startTime: this.startTime.toISOString(),
      answerTime: Math.round(answerTime),
      closedQuestions,
      openQuestions,
      imageQuestions
    };

    this.setState({
      submitted: true,
    });
  };

  onNext = (e) => {
    this.setState({ loading: true });
    console.log(this.adventureAnswer);
    
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
    console.log(this.props);

    if (!this.props.isAuthenticated) {
      return <Redirect to='/login' />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to='/'/>
      );
    }
    if (this.state.ended) {
      return (
        <Redirect to='/'/>
      );
    }
    return (
      <ThemeProvider theme={this.theme}>
        <div className={classes.root}>
          <CssBaseline />
          <NavBar logout={this.props.logout} title={'Przed Tobą walka'} returnLink={'/'} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <div style={{ margin: '5px' }}>
              {this.state.loading ? <LinearProgress /> :
                <React.Fragment>
                  {this.state.answerMode &&
                    <Adventure 
                      closedQuestions={this.state.closedQuestions}
                      openQuestions={this.state.openQuestions}
                      imageQuestions={this.state.imageQuestions}
                      submitted={this.state.submitted}
                      adventurePart={this.props.adventurePart}
                      onAnswerChange={this.onAnswerChange}
                      onOpenAnswerChange={this.onOpenAnswerChange}
                      onImageAnswerChange={this.onImageAnswerChange}
                      onSubmit={this.onSubmitAnswer}
                      onNext={this.onNext}
                      timeLimit={this.state.timeLimit}
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
                      rank={this.props.rank}
                    />
                  }
                </React.Fragment>
              }
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  adventurePart: state.course.adventurePart,
  achievements: state.course.achievements,
  rank: state.course.studentRank,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, { startChapter, addAdventureAnswer, chooseNextAdventure, logout, getAchievementsAfterChapter, getRankAfterChapter }),
  withStyles(styles),
)(ChapterPassing);
