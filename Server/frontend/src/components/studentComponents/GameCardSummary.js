import React, { Component } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';


export class GameCardSummary extends Component {
  rankName = 'porg';
  rankScoreMax = '5%';
  rankScoreMin = '0';

  render() {
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
              Oznacza to, że Twój wynik się pomiędzy {this.rankScoreMin}, a {this.rankScoreMax} poprawnych odpowiedzi.
            </Typography>
          </CardContent>
        </Card>


      </>
    );
  }
}


export default GameCardSummary;
