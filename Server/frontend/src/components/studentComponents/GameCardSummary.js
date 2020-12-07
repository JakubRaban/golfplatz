import React, {Component} from 'react';
import {Card, CardContent, CardMedia, Typography} from '@material-ui/core';
import {isEmpty} from 'lodash';

export class GameCardSummary extends Component {
  state = {achievementsLoaded: false, rankLoaded: false};

  componentDidMount() {
    if (this.props.achievements?.accomplished?.length > 0 || this.props.achievements?.notAccomplished?.length > 0) {
      this.setState({achievementsLoaded: true});
    }
    if (!isEmpty(this.props.studentRank)) {
      this.setState({rankLoaded: true});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.achievements !== prevProps.achievements) {
      this.setState({achievementsLoaded: true});
    }
    if (this.props.studentRank !== prevProps.studentRank) {
      this.setState({rankLoaded: true});
    }
  }

  getScoreDescription = (achievement) => {
    return `zdobycie minimum ${achievement.percentage} procent punktów`;
  }

  getTimeDescription = (achievement) => {
    return `wykorzystanie nie więcej niż ${achievement.percentage} procent czasu na ograniczone czasowo zadania`;
  }

  getDescription = (achievement) => {
    const description = achievement.conditionType === 'SCORE' ?
      this.getScoreDescription(achievement) : this.getTimeDescription(achievement);

    const chapterStr = achievement.howMany === 1 ? 'rozdziale' : 'rozdziałach';
    const plotPartStr = achievement.howMany === 1 ? 'części fabuły' : 'częściach fabuły';

    const result = description + ` w co najmniej ${achievement.howMany} 
      ${achievement.courseElementConsidered === 'CHAPTER' ? chapterStr : plotPartStr}
      ${achievement.inARow ? 'pod rząd' : 'ogółem'}.`

    return result;
  }

  renderAchievement = (achievement, index, accomplished = false) => {
    const cardMediaStyle = accomplished ? {height: '140px'} : {height: '140px', opacity: '10%'};

    return (
      <Card key={index + 100*accomplished} style={{width: '350px', margin: '5px'}}>
        <CardMedia
          style={cardMediaStyle}
          component='img'
          src={achievement.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {achievement.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Przyznawana za {this.getDescription(achievement)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  renderRank = () => {
    const { nextRankThreshold, studentRank } = this.props;
    if (studentRank.rank)
      return (
        <Card style={{display: 'flex'}}>
          <CardMedia style={{height: '140px', width: '140px'}}
                     image={this.props.studentRank.rank.image}
                     title='Rank image'
          />
          <CardContent>
            <Typography component='h6' variant='h6'>
              Twoja ranga w kursie to: {this.props.studentRank.rank.name}
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              Oznacza to, że Twój wynik wynosi przynajmniej {this.props.studentRank.rank.lowerThresholdPercent}%.
              {nextRankThreshold <= 100 ? ` Zdobądź minimum ${nextRankThreshold}%, aby uzyskać wyższą rangę!` : 'To najwyższa możliwa ranga - tak trzymaj!'}
            </Typography>
          </CardContent>
        </Card>
      );
    return (
      <Typography component='h6' variant='h6'>
        Twój wynik w kursie to: {this.props.studentRank.scorePercent}%
      </Typography>
    );
  }

  render() {
    console.log(this.props);
    return (
      <>
        {this.state.rankLoaded && this.renderRank()}

        {this.state.achievementsLoaded &&
        <Typography component='h6' variant='h6'>
          {this.props.achievements.accomplished.length > 0 || this.props.achievements.notAccomplished.length > 0
            ? 'Odznaki w kursie:' : 'Prowadzący nie zdefiniował odznak w tym kursie.'}
        </Typography>
        }
        <div style={{display: 'flex'}}>
          {this.state.achievementsLoaded && this.props.achievements?.accomplished.map((achievement, index) =>
            this.renderAchievement(achievement, index, true)
          )}
          {this.state.achievementsLoaded && this.props.achievements?.notAccomplished.map((achievement, index) =>
            this.renderAchievement(achievement, index)
          )}
        </div>
      </>
    );
  }
}

export default GameCardSummary;
