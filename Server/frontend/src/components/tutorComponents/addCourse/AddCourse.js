import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty as empty } from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';
import isInt from 'validator/lib/isInt.js';
import { setWith } from 'lodash';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../../actions/auth.js';
import { MAIN_COLOR } from '../../../actions/color.js';
import { addCourse } from '../../../actions/course.js';
import { styles } from '../../../styles/style.js';
import NavBar from '../../common/navbars/NavBar.js';
import AddAchievements from './AddAchievements.js';
import AddCourseInitialInfo from './AddCourseInitialInfo.js';
import AddGroupsAndPlot from './AddGroupsAndPlot.js';
import AddRanks from './AddRanks.js';
import AddWeights from './AddWeights.js';
import ColorPicker from "./ColorPicker";
import SelectRankingMode from "./SelectRankingMode";
import FormErrorMessage from "../../common/FormErrorMessage";

export class AddCourse extends Component {
  state = {
    name: '',
    description: '',
    courseGroups: [''],
    plotParts: [{ name: '', introduction: '' }],
    redirect: false,
    weights: {
      'QUIZ': '1',
      'GENERIC': '1',
      'TEST': '1',
      'HOMEWORK': '1',
      'ACTIVENESS': '1',
    },
    achievements: [],
    ranks: [],
    rankingMode: 'FULL',
    themeColor: MAIN_COLOR,
    errors: {},
  };

  emptyAchievement = {
    name: '',
    image: '',
    courseElementConsidered: 'NOT SELECTED',
    howMany: '0',
    inARow: false,
    conditionType: 'NOT SELECTED',
    adventureCategoryIncluded: 'ALL',
    percentage: '0',
  }

  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  addNewAchievement = () => {
    const { achievements } = this.state;
    achievements.push({ ...this.emptyAchievement });
    this.setState({ achievements });
  }

  handleAchievementChange = (input, index, value) => {
    const { achievements } = this.state;
    achievements[index][input] = value;
    this.setState({ achievements });
  }

  addNewCourseGroup = () => {
    const { courseGroups } = this.state;
    courseGroups.push('');
    this.setState({ courseGroups });
  }

  handleGroupChange = (index, value) => {
    const { courseGroups } = this.state;
    courseGroups[index] = value;
    this.setState({ courseGroups });
  }

  addNewPlotPart = () => {
    const { plotParts } = this.state;
    plotParts.push({ name: '', introduction: '' });
    this.setState({ plotParts });
  }

  handlePlotPartChange = (input, index, value) => {
    const { plotParts } = this.state;
    plotParts[index][input] = value;
    this.setState({ plotParts });
  }

  addNewRank = () => {
    const { ranks } = this.state;
    ranks.push({ name: '', image: '', lowerThresholdPercent: '0' });
    this.setState({ ranks });
  }

  removeRank = (index) => {
    const { ranks } = this.state;
    ranks.splice(index, 1);
    this.setState({ ranks });
  }

  removeAchievement = (index) => {
    const { achievements } = this.state;
    achievements.splice(index, 1);
    this.setState({ achievements });
  }

  handleRankChange = (input, index, value) => {
    const { ranks } = this.state;
    ranks[index][input] = value;
    this.setState({ ranks });
  }

  handleWeightChange = (categoryName, value) => {
    const {weights} = this.state;
    weights[categoryName] = value;
    this.setState({weights});
  }

  handleRankingModeChange = (e) => {
    this.setState({ rankingMode: e.target.value });
  }

  changeColor = (color) => {
    this.setState({ themeColor: color.hex });
  }

  checkErrors = async () => {
    const errors = {}
    if (isEmpty(this.state.name)) errors.name = 'Nazwa kursu nie może być pusta'
    if (isEmpty(this.state.description)) errors.description = 'Opis kursu nie może być pusty'
    this.state.courseGroups.forEach((group, i) => {
      if (isEmpty(group)) setWith(errors, `groups[${i}]`, 'Nazwa grupy nie może być pusta');
    });
    this.state.plotParts.forEach((plotPart, i) => {
      if (isEmpty(plotPart.name)) setWith(errors, `plotParts[${i}].name`, 'Nazwa części fabuły nie może być pusta');
      if (isEmpty(plotPart.introduction)) setWith(errors, `plotParts[${i}].introduction`, 'Opis części fabuły nie może być pusty');
    });
    this.state.achievements.forEach((achievement, i) => {
      if (isEmpty(achievement.name))
        setWith(errors, `achievements[${i}].name`, 'Nazwa odznaki nie może być pusta');
      if (isEmpty(achievement.image))
        setWith(errors, `achievements[${i}].image`, 'Prześlij obrazek odznaki');
      if (achievement.courseElementConsidered === 'NOT SELECTED')
        setWith(errors, `achievements[${i}].courseElementConsidered`, 'Wybierz element kursu');
      if (!isInt(achievement.howMany, { min: 1 }))
        setWith(errors, `achievements[${i}].howMany`, 'Podaj liczbę większą od 0', Object);
      if (achievement.conditionType === 'NOT SELECTED')
        setWith(errors, `achievements[${i}].conditionType`, 'Wybierz sprawdzany warunek');
      if (!isInt(achievement.percentage, { min: 1 }))
        setWith(errors, `achievements[${i}].percentage`, 'Podaj liczbę większą od 0', Object)
    });
    this.state.ranks.forEach((rank, i) => {
      if (isEmpty(rank.name))
        setWith(errors, `ranks[${i}].name`, 'Nazwa rangi nie może być pusta');
      if (isEmpty(rank.image))
        setWith(errors, `rank[${i}].image`, 'Prześlij obrazek odznaki');
      if(!isInt(rank.lowerThresholdPercent, { min: 0, max: 100 }))
        setWith(errors, `ranks[${i}].lowerThresholdPercent`, 'Podaj liczbę całkowitą od 0 do 100');
    });
    for(const [key, value] of Object.entries(this.state.weights)) {
      if(!isInt(value, { min: 1 })) setWith(errors, `weights.${key}`, 'Podaj liczbę całkowitą większą od 0');
    }
    await this.setState({ errors })
  }

  onSubmit = async () => {
    await this.checkErrors();
    for (const achievement of this.state.achievements) {
      if (achievement.adventureCategoryIncluded === 'ALL') achievement.adventureCategoryIncluded = null;
    }

    if (empty(this.state.errors)) {
      const { name, description, courseGroups, plotParts, achievements, ranks, weights, rankingMode, themeColor } = this.state;
      const course = { name, description, themeColor, rankingMode };
      const result = await this.props.addCourse(course, courseGroups, plotParts, achievements, ranks, weights);
      console.log(result, typeof result);
      if (result === "ok") {
        this.setState({redirect: true});
      }
    }
  };

  render() {
    const { name, description, courseGroups, plotParts } = this.state;
    const values = { name, description };
    const { classes } = this.props;

    if (this.state.redirect) {
      return (
        <Redirect to="/"/>
      );
    }
    if (!this.props.isAuthenticated) {
      return (
        <Redirect to="/login"/>
      );
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Dodaj kurs'} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <AddCourseInitialInfo
            errors={this.state.errors}
            handleChange={this.handleChange}
            values={values}
          />
          <AddGroupsAndPlot
            addNewCourseGroup={this.addNewCourseGroup}
            addNewPlotPart={this.addNewPlotPart}
            errors={this.state.errors}
            groups={courseGroups}
            handleGroupChange={this.handleGroupChange}
            handlePlotPartChange={this.handlePlotPartChange}
            plotParts={plotParts}
          />
          <AddAchievements
            achievements={this.state.achievements}
            addNewAchievement={this.addNewAchievement}
            errors={this.state.errors}
            handleAchievementChange={this.handleAchievementChange}
            removeAchievement={this.removeAchievement}
          />
          <AddWeights
            weights={this.state.weights}
            handleWeightChange={this.handleWeightChange}
            errors={this.state.errors}
          />
          <AddRanks
            addNewRank={this.addNewRank}
            errors={this.state.errors}
            handleRankChange={this.handleRankChange}
            ranks={this.state.ranks}
            removeRank={this.removeRank}
          />
          <SelectRankingMode
            rankingMode={this.state.rankingMode}
            handleChange={this.handleRankingModeChange}
          />
          <ColorPicker
            color={this.state.themeColor}
            changeColor={this.changeColor}
          />
          <div style={{ float: 'right', marginBottom: '10px', marginRight: '5px' }}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.onSubmit}
            >Potwierdź i wyślij</Button>
          </div>
          {!empty(this.state.errors) && <FormErrorMessage style={{textAlign: 'right'}}/>}
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { addCourse, logout }),
  withStyles(styles),
)(AddCourse);
