import React, { Component } from 'react';
import { Button, Card, CardContent, CardMedia, Typography } from '@material-ui/core';


export class Summary extends Component {
  state = { achievementsLoaded: false };

  componentDidUpdate(prevProps) {
    if (prevProps.achievements !== this.props.achievements && this.props.achievements.status === 'calculated') {
      this.setState({ achievementsLoaded: true });
    }
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
        <Button variant="contained" onClick={this.props.endChapter}>
          Zakończ rozdział
        </Button>

      </div>
    );
  }
}

export default Summary;
