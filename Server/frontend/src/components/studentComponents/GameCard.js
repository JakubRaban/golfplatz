import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavBar from '../common/navbars/NavBar.js';
import compose from 'recompose/compose';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { logout } from '../../actions/auth.js';
import { getAchievements, getAllRanks, getStudentRank, getStudentRanking, getStudentMarks } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import GameCardSummary from './GameCardSummary.js'
import Ranking from './Ranking.js';
import StudentMarks from './StudentMarks.js';

export class GameCard extends Component {
  state = { loading: false, mode: 'summary', nextRankThreshold: 101 };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
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

  componentDidMount() {
    this.makeRequests();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.studentRank !== this.props.studentRank) {
      const index = this.props.ranks.findIndex((rank) => this.props.studentRank.rank.id === rank.id);
      if (index !== this.props.ranks.length - 1)
        this.setState({ nextRankThreshold: this.props.ranks[index+1].lowerThresholdPercent });
    }
  }

  makeRequests = async () => {
    await this.props.getAchievements(this.props.match.params.id);
    await this.props.getAllRanks(this.props.match.params.id);
    await this.props.getStudentRank(this.props.match.params.id);
    await this.props.getStudentRanking(this.props.match.params.id);
    await this.props.getStudentMarks(this.props.match.params.id);
  }

  handleChange = (e, mode) => {
    this.setState({ mode });
  }

  renderTab() {
    switch(this.state.mode) {
      case 'summary':
        return <GameCardSummary
          achievements={this.props.achievements}
          nextRankThreshold={this.state.nextRankThreshold}
          studentRank={this.props.studentRank}
        />;
      case 'marks':
        return <StudentMarks marks={this.props.studentMarks} />;
      case 'ranking':
        return <Ranking ranking={this.props.ranking} />;
    }
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      );
    }
    const { classes } = this.props;
    return (
      <ThemeProvider theme={this.theme}>
        <div className={classes.root}>
          <CssBaseline />
          <NavBar logout={this.props.logout} title={`Karta gry - ${this.props.user.firstName} ${this.props.user.lastName}`} returnLink={'/'} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <div style={{ margin: '5px' }}>
              {this.state.loading ? <div>Ładowanie</div> :
                <>
                  <Tabs value={this.state.mode} onChange={this.handleChange}>
                    <Tab label='Podsumowanie' value='summary'/>
                    <Tab label='Twoje oceny' value='marks'/>
                    <Tab label='Ranking' value='ranking'/>
                  </Tabs>
                  {this.renderTab()}
                </>
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
  achievements: state.course.achievements,
  ranks: state.course.ranks,
  studentRank: state.course.studentRank,
  ranking: state.course.ranking,
  studentMarks: state.course.studentMarks,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, { logout, getAchievements, getAllRanks, getStudentRank, getStudentRanking, getStudentMarks }),
  withStyles(styles),
)(GameCard);
