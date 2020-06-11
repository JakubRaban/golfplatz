import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField, { Input } from '@material/react-text-field';
import Box from '@material-ui/core/Box';


class Timer extends React.Component {
  format(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
    seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
    return minutes + ':' + seconds;
  }
  render () {
    const {time} = this.props;
    return (
      <div>
        <h1>{this.format(time)}</h1>
      </div>
    )
  }
}

export class Adventure extends Component {
  render() {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          {this.props.adventurePart.adventure.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {this.props.adventurePart.adventure.taskDescription}
        </Typography>
        {!this.props.submitted ?
        <React.Fragment>
          {/* {this.props.adventurePart.adventure.hasTimeLimit && <Timer time={this.props.timeLimit}/>} */}
          {this.props.adventurePart.adventure.pointSource.questions.map((question, i) => (
            <React.Fragment>
              <Typography variant="subtitle2" gutterBottom>
                {question.text}
              </Typography>
              {this.props.closedQuestions.length === 0 ? 
                <TextField className="answer" label="Twoja odpowiedź:">
                  <Input
                    type="answer"
                    name="answer"
                    onChange={this.props.onOpenAnswer(i)}
                    value={this.props.openQuestions[i].givenAnswer}
                  />
                </TextField>
                :
                <FormControl component="fieldset">
                  <FormGroup>
                    {question.answers.map((answer, j) => (
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={this.props.closedQuestions[i].givenAnswers[j].marked}
                            onChange={this.props.onAnswer(i, j)} name="answer"
                          />
                        }                          
                        label={<Box component="div" fontSize={13}> {answer.text} </Box>} />
                    ))}
                  </FormGroup>
                </FormControl>
              }
            </React.Fragment>
          ))}
          <div style={{display: 'block'}}>
            <Button variant="contained" onClick={this.props.onSubmit}>Zatwierdź</Button>
          </div>
          
        </React.Fragment>
          : 
          <React.Fragment>
          {this.props.adventurePart.adventure.pointSource.questions.map((question, i) => (
            <React.Fragment>
              <Typography variant="subtitle1" gutterBottom>
                {question.text}
              </Typography>
              <FormControl component="fieldset">
                <FormGroup>
                  {question.answers.map((answer, j) => (
                  <React.Fragment>
                    <FormControlLabel
                      control={<Checkbox checked={this.props.closedQuestions[i].givenAnswers[j].marked}
                      name="answer" />}
                      label={answer.text}
                    />
                    {this.props.closedQuestions[i].givenAnswers[j].marked &&
                      <Typography variant="subtitle2" gutterBottom>
                        {answer.isCorrect ? question.messageAfterCorrectAnswer : question.messageAfterIncorrectAnswer}
                      </Typography> 
                    }
                  </React.Fragment>
                  ))}
                </FormGroup>
              </FormControl>
            </React.Fragment>
          ))}
          <div style={{display: 'block'}}>
            <Button variant="contained" onClick={this.props.onNext}>Dalej</Button>
          </div>
          
        </React.Fragment>
        }
                  
      </div> 
    )
  }
}

export default connect(null)(Adventure);
          