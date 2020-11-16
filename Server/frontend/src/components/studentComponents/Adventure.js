import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import TextField, { Input } from '@material/react-text-field';
import React, { Component } from 'react';
import { connect } from 'react-redux';


class Timer extends React.Component {
  format(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? `0${minutes}` : minutes;
    seconds = seconds.toString().length === 1 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  render() {
    const { time } = this.props;
    return (
      <div>
        <h1>{this.format(time)}</h1>
      </div>
    );
  }
}

export class Adventure extends Component {
  handleImage = (id) => (e) => {
    const file = e.target.files[0];
    console.log(e);
    console.log(e.target.files);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.props.onImageAnswerChange(id, reader.result);
    };
    reader.readAsDataURL(file);
  }

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
            {/* {this.props.adventurePart.adventure.timeLimit > 0 && <Timer time={this.props.timeLimit}/>} */}
            {this.props.adventurePart.adventure.pointSource.questions.map((question, i) =>
              <React.Fragment key={i}>
                <Typography variant="subtitle2" gutterBottom>
                  {question.text}
                </Typography>
                {question.questionType === 'OPEN' ?
                  <>
                    {question.inputType === 'IMAGE' ? 
                      <>
                        <InputLabel>Prześlij odpowiedź:</InputLabel>
                        <input type="file" name="image" accept="image/*" onChange={this.handleImage(question.id)}/>
                      </>:
                      <>
                        <TextField label="Twoja odpowiedź:" variant="outlined" style = {{ width: 500 }}>
                          <Input
                            type="answer"
                            name="answer"
                            onChange={this.props.onOpenAnswerChange(question.id)}
                            value={this.props.openQuestions.get(question.id)}
                          />
                        </TextField> 
                      </>
                      }
                  </>:
                  <FormControl component="fieldset">
                    <FormGroup>
                      {question.answers.map((answer, j) =>
                        <FormControlLabel key={i * j}
                          control={
                            <Checkbox
                              checked={this.props.closedQuestions.get(question.id)[j].marked}
                              onChange={this.props.onAnswerChange(question.id, j, i)} name="answer"
                            />
                          }
                          label={<Box component="div" fontSize={13}> {answer.text} </Box>} />,
                      )}
                    </FormGroup>
                  </FormControl>
                }
              </React.Fragment>,
            )}
            <div style={{ display: 'block' }}>
              <Button variant="contained" onClick={this.props.onSubmit}>Zatwierdź</Button>
            </div>

          </React.Fragment> :
          <React.Fragment>
            {this.props.adventurePart.adventure.pointSource.questions.map((question, i) =>
              <React.Fragment key={i}>
                <Typography variant="subtitle1" gutterBottom>
                  {question.text}
                </Typography>
                {question.questionType === 'CLOSED' ?
                  <FormControl component="fieldset">
                    <FormGroup>
                      {question.answers.map((answer, j) =>
                        <React.Fragment key={i * j}>
                          <FormControlLabel
                            control={<Checkbox checked={this.props.closedQuestions.get(question.id)[j].marked}
                              name="answer" />}
                            label={answer.text}
                          />
                          {this.props.closedQuestions.get(question.id)[j].marked &&
                        <Typography variant="subtitle2" gutterBottom>
                          {answer.isCorrect ? question.messageAfterCorrectAnswer : question.messageAfterIncorrectAnswer}
                        </Typography>
                          }
                        </React.Fragment>,
                      )}
                    </FormGroup>
                  </FormControl> :
                  <Typography variant="subtitle2" gutterBottom>
                Twoja odpowiedź: {this.props.openQuestions.get(question.id)}
                  </Typography>
                }
              </React.Fragment>,
            )}
            <div style={{ display: 'block' }}>
              <Button variant="contained" onClick={this.props.onNext}>Dalej</Button>
            </div>

          </React.Fragment>
        }

      </div>
    );
  }
}

export default connect(null)(Adventure);
