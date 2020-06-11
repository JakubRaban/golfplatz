import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


export class Summary extends Component {
  render() {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          Podsumowanie Twoich wyników:
        </Typography>
        {this.props.adventurePart.summary.map(sum =>(
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
              {sum.adventureName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Udzieliłeś odpowiedzi w ciągu: <Typography variant="subtitle2" gutterBottom>{sum.answerTime}</Typography>
            </Typography>
            {sum.questionSummaries.map(question =>(
              <React.Fragment>
                <Typography variant="subtitle1" gutterBottom>
                  {question.text}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {question.pointsScored}/{question.maxPoints}
                </Typography>
              </React.Fragment>  
            ))}
          </React.Fragment>
        ))}
        <Typography variant="h5" gutterBottom>
          Dziękujemy za podróż z PKP Intercity
        </Typography>
        <Button variant="contained" onClick={this.props.endChapter}>
          Zakończ rozdział
        </Button>
       
      </div>
    )
  }
}

export default connect(null)(Summary);