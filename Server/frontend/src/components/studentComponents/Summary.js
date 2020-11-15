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
    console.log(this.props);
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          Podsumowanie Twoich wyników:
        </Typography>
        {this.props.adventurePart.summary.map((sum, i) =>
          <React.Fragment key={i}>
            <Typography variant="h6" gutterBottom>
              {sum.adventureName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Udzieliłeś odpowiedzi w ciągu: <Typography variant="subtitle2" gutterBottom>{sum.answerTime}</Typography>
            </Typography>
            {sum.questionSummaries.map((question, j) =>
              <React.Fragment key={i * j}>
                <Typography variant="subtitle1" gutterBottom>
                  {question.text}
                </Typography>
                {question.isAutoChecked ?
                  <Typography variant="subtitle2" gutterBottom>
                    {question.pointsScored}/{question.maxPoints}
                  </Typography> :
                  <Typography variant="subtitle2" gutterBottom>
                    To pytanie zostanie ocenione przez prowadzącego.
                  </Typography>
                }
              </React.Fragment>,
            )}
          </React.Fragment>,
        )}
        { this.state.achievementsLoaded &&
          this.props.achievements.achievements.map((achievement) => 
            <>
              <Typography variant="h5" gutterBottom>Zdobyto odznakę!</Typography>
              <Card style={{width: '350px', margin: '5px'}}>
                <CardMedia
                  style={{height: '140px'}}
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
            </>
          ) 
        }
        {
          this.state.rankLoaded &&
            <>
              <Typography variant="h5" gutterBottom>Zaktualizowano rangę!</Typography>

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
        <Button variant="contained" onClick={this.props.endChapter}>
          Zakończ rozdział
        </Button>

      </div>
    );
  }
}

export default Summary;
