import React, { Component } from 'react';
import { Button, Card, CardContent, CardMedia, Typography } from '@material-ui/core';


export class Summary extends Component {
  state = { achievementsLoaded: false, rankLoaded: false };

  componentDidUpdate(prevProps) {
    if (prevProps.achievements !== this.props.achievements && this.props.achievements.status === 'calculated') {
      this.setState({ achievementsLoaded: true });
    }
    if (prevProps.rank !== this.props.rank && this.props.rank.status === 'calculated') {
      this.setState({ rankLoaded: true });
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

  render() {
    return (
      <>
        <Typography variant='h5' gutterBottom>
          {this.props.adventurePart.chapterName} - Podsumowanie Twoich wyników:
        </Typography>
        <div style={{ width: '100%', margin: '5px', padding: '5px' }}>
          {this.props.adventurePart.summary.map((sum, i) =>
            <div key={i} style={{ margin: '5px' }}>
              <Typography variant='h6' gutterBottom>
                {sum.adventureName}
              </Typography>
              <Typography variant='body1' gutterBottom>
                Udzieliłeś odpowiedzi w ciągu: {sum.answerTime} sekund
              </Typography>
              {sum.questionSummaries.map((question, j) =>
                <div key={i * j + 15000}style={{ display: 'flex' }}>                    
                  {question.isAutoChecked ?
                    <Typography variant='subtitle2' gutterBottom>
                      {question.text} ({question.pointsScored}/{question.maxPoints})
                    </Typography> :
                    <Typography variant='subtitle2' gutterBottom>
                      {question.text} - To pytanie zostanie ocenione przez prowadzącego.
                    </Typography>
                  }
                </div>
              )}
            </div>,
          )}
          { this.state.achievementsLoaded &&
            this.props.achievements.achievements.map((achievement) => 
              <>
                <Typography variant='h5' gutterBottom>Zdobyto odznakę!</Typography>
                <Card style={{width: '350px', margin: '5px'}}>
                  <CardMedia
                    style={{height: '140px'}}
                    component='img'
                    src={achievement.image}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {achievement.name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' component='p'>
                      Przyznawana za {this.getDescription(achievement)}
                    </Typography>
                  </CardContent>
                </Card>
              </>
            ) 
          }
          {
            this.state.rankLoaded &&
              <>
                <Typography variant='h5' gutterBottom>Zaktualizowano rangę!</Typography>

                <Card style={{display: 'flex'}}>
                  <CardMedia style={{height: '140px', width: '140px'}}
                    image={this.props.rank.rank.image}
                    title='Rank image'
                  />
                  <CardContent>
                    <Typography component='h6' variant='h6'>
                      Twoja ranga w kursie to: {this.props.rank.rank.name}
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary'>
                      Oznacza to, że Twój wynik wynosi przynajmniej {this.props.rank.rank.lowerThresholdPercent}%.
                    </Typography>
                  </CardContent>
                </Card>
              </>
          }
          <Button variant='contained' onClick={this.props.endChapter}>
            Zakończ rozdział
          </Button>

        </div>
      </>
    );
  }
}

export default Summary;
