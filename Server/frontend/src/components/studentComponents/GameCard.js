import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavBar from '../common/NavBar.js';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { getAchievements } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import GameCardSummary from './GameCardSummary.js'
import Ranking from './Ranking.js';
import StudentMarks from './StudentMarks.js';

export class GameCard extends Component {
  state = { loading: false, mode: 'summary' };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidMount() {
    this.props.getAchievements(this.props.match.params.id);
  }

  handleChange = (e, mode) => {
    this.setState({ mode });
  }

  renderTab() {
    switch(this.state.mode) {
      case 'summary':
        return <GameCardSummary achievements={this.props.achievements}/>;
      case 'marks':
        return <StudentMarks/>;
      case 'ranking':
        return <Ranking/>;
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

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  achievements: state.course.achievements
});

export default compose(
  connect(mapStateToProps, { logout, getAchievements }),
  withStyles(styles),
)(GameCard);
