import React, { Component } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';


export class GameCardSummary extends Component {
  state = { loaded: false };

  componentDidMount() {
    if (this.props.achievements?.accomplished.length > 0 || this.props.achievements?.notAccomplished.length > 0) {
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.achievements !== prevProps.achievements) {
      this.setState({ loaded: true });
    }
  }

  rankName = 'porg';
  rankScoreMax = '5%';
  rankScoreMin = '0';

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

  renderAchievement = (achievement, accomplished = false) => {
    const cardMediaStyle = accomplished ? { height: '140px' } : { height: '140px', opacity: '10%' };

    return (
      <Card style={{ width: '350px', margin: '5px' }}>
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

  render() {
    console.log(this.state.loaded);
    return (
      <>
        <Card style={{display: 'flex'}}>
          <CardMedia style={{height: '140px', width: '140px'}}
            image='/static/porg_better.png'
            title='Rank image'
          />
          <CardContent>
            <Typography component='h6' variant='h6'>
              Twoja ranga w kursie to: {this.rankName}
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              Oznacza to, że Twój wynik mieści się pomiędzy {this.rankScoreMin}, a {this.rankScoreMax} zdobytych punktów.
            </Typography>
          </CardContent>
        </Card>

        {this.state.loaded &&
          <Typography component='h6' variant='h6'>
            {this.props.achievements.accomplished.length > 0 || this.props.achievements.notAccomplished.length > 0
              ? 'Odznaki w kursie:' : 'Prowadzący nie zdefiniował odznak w tym kursie.'}
          </Typography>
        }
        <div style={{display: 'flex'}}>
          {this.state.loaded && this.props.achievements?.accomplished.map((achievement) =>
            this.renderAchievement(achievement, true)
          )}
          {this.state.loaded && this.props.achievements?.notAccomplished.map((achievement) => 
            this.renderAchievement(achievement)
          )}
        </div>
    </>
    );
  }
}

export default GameCardSummary;
