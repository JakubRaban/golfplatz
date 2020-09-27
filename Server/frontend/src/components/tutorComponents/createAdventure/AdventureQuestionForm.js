
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField } from '@material-ui/core';
import React from 'react';

import AnswerList from './AnswerList.js';

class AdventureQuestionForm extends React.Component {
  handleChange = (e) => {
    if (e.target.name === 'isAutoChecked') this.props.updateQuestion(this.props.index, { isAutoChecked: e.target.checked, questionType: 'OPEN' });
    else this.props.updateQuestion(this.props.index, { [e.target.name]: e.target.value });
  }

  handleDelete = () => {
    this.props.deleteQuestion(this.props.index);
  }

  render() {
    const { question } = this.props;
    return (
      <>
        <div>Pytanie {this.props.index + 1}</div>
        <form>
          <TextField id={'standard-basic'} label={'Treść pytania'} name={'text'} value={question.text} onChange={this.handleChange}/>
          <FormControlLabel control={<Switch checked={question.isAutoChecked} name={'isAutoChecked'} onChange={this.handleChange}/>} label={'Sprawdzane automatycznie'} />
          <FormControl component={'fieldset'}>
            <FormLabel component={'legend'}>Rodzaj pytania</FormLabel>
            <RadioGroup name={'questionType'} value={question.questionType} onChange={this.handleChange}>
              <FormControlLabel control={<Radio />} label={'Zamknięte'} value={'CLOSED'} disabled={!question.isAutoChecked}/>
              <FormControlLabel control={<Radio />} label={'Otwarte'} value={'OPEN'} />
            </RadioGroup>
          </FormControl>
          <FormControl component={'fieldset'}>
            <FormLabel component={'legend'}>Typ odpowiedzi</FormLabel>
            <RadioGroup name={'inputType'} value={question.inputType} onChange={this.handleChange}>
              <FormControlLabel control={<Radio />} label={'Krótka'} value={'TEXTFIELD'} />
              <FormControlLabel control={<Radio />} label={'Wielolinijkowa'} value={'TEXTAREA'} />
            </RadioGroup>
          </FormControl>
          {question.isAutoChecked && <AnswerList question={question} questionIndex={this.props.index} addAnswer={this.props.addAnswer}
            updateAnswer={this.props.updateAnswer} deleteAnswer={this.props.deleteAnswer}/>}
          <TextField id={'standard-basic'} label={question.isAutoChecked ? 'Punkty za popr. odp.' : 'Max. punktów za to pytanie'} name={'pointsPerCorrectAnswer'}
            value={question.pointsPerCorrectAnswer} onChange={this.handleChange}/>
          {question.isAutoChecked && <TextField id={'standard-basic'} label={'Komunikat po popr. odp.'} name={'messageAfterCorrectAnswer'}
            value={question.messageAfterCorrectAnswer} onChange={this.handleChange}/>}
          <TextField id={'standard-basic'} label={question.isAutoChecked ? 'Punkty za niepopr. odp.' : 'Min. punktów za to pytanie'} name={'pointsPerIncorrectAnswer'}
            value={question.pointsPerIncorrectAnswer} onChange={this.handleChange}/>
          {question.isAutoChecked && <TextField id={'standard-basic'} label={'Komunikat po niepopr. odp.'} name={'messageAfterIncorrectAnswer'}
            value={question.messageAfterIncorrectAnswer} onChange={this.handleChange}/>}
          <Button onClick={this.handleDelete}>Usuń to pytanie</Button>
        </form>
      </>
    );
  }
}

export default AdventureQuestionForm;
