import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { connect } from 'react-redux';


export class Summary extends Component {
  render() {
    console.log(this.props.adventurePart.summary);
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
        <Button variant="contained" onClick={this.props.endChapter}>
          Zakończ rozdział
        </Button>

      </div>
    );
  }
}

export default connect(null)(Summary);
