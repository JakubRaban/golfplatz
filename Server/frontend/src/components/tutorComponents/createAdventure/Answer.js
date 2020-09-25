import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';

class Answer extends React.Component {
  handleChange = (e) => {
    this.props.updateAnswer(this.props.questionIndex, this.props.answerIndex,
      { [e.target.name]: ['isCorrect', 'isRegex'].includes(e.target.name) ? e.target.checked : e.target.value });
  }

  render() {
    const { answer } = this.props;
    const isOpenQuestion = this.props.questionType === 'OPEN';
    return (
      <>
        <TextField id={'standard-basic'} value={answer.text} onChange={this.handleChange} name={'text'}
          label={`${isOpenQuestion ? 'Prawidłowa odpowiedź' : 'Wariant odpowiedzi'} ${this.props.answerIndex + 1}`}/>
        {
          !isOpenQuestion &&
          <FormControlLabel
            control={<Switch checked={answer.isCorrect} onChange={this.handleChange} name={'isCorrect'}/>}
            label={'Prawidłowa'}/>
        }
        <FormControlLabel
          control={<Switch checked={answer.isRegex} onChange={this.handleChange} name={'isRegex'}/>}
          label={'Wyrażona jako regex'}/>
      </>
    );
  }
}

export default Answer;
