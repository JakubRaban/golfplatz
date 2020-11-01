
import { Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Switch, TextField } from '@material-ui/core';
import React from 'react';
import { get } from 'lodash'

import AnswerList from './AnswerList.js';

class AdventureQuestionForm extends React.Component {
  handleChange = (e) => {
    if (e.target.name === 'isAutoChecked') this.props.updateQuestion(this.props.index, { isAutoChecked: e.target.checked, questionType: 'OPEN', answers: [] });
    else this.props.updateQuestion(this.props.index, { [e.target.name]: e.target.value });
  }

  handleDelete = () => {
    this.props.deleteQuestion(this.props.index);
  }

  render() {
    const { question, errors, index } = this.props;
    return (
      <>
        <div>Pytanie {index + 1}</div>
        <FormGroup>
          <TextField label={'Treść pytania'} name={'text'} value={question.text} onChange={this.handleChange}
            error={get(errors, `questions[${index}].text`, false)}
            helperText={get(errors, `questions[${index}].text`, '')}/>
          <FormControlLabel control={<Switch checked={question.isAutoChecked} name={'isAutoChecked'} onChange={this.handleChange}/>} label={'Sprawdzane automatycznie'} />
          <FormGroup row>
            <FormControl component={'fieldset'}>
              <FormLabel component={'legend'}>Rodzaj pytania</FormLabel>
              <RadioGroup name={'questionType'} value={question.questionType} onChange={this.handleChange}>
                <FormControlLabel control={<Radio/>} label={'Zamknięte'} value={'CLOSED'}
                  disabled={!question.isAutoChecked}/>
                <FormControlLabel control={<Radio/>} label={'Otwarte'} value={'OPEN'}/>
              </RadioGroup>
            </FormControl>
            <FormControl component={'fieldset'}>
              <FormLabel component={'legend'}>Typ odpowiedzi</FormLabel>
              <RadioGroup name={'inputType'} value={question.inputType} onChange={this.handleChange}>
                <FormControlLabel control={<Radio/>} label={'Krótka'} value={'TEXTFIELD'}/>
                <FormControlLabel control={<Radio/>} label={'Wielolinijkowa'} value={'TEXTAREA'}/>
              </RadioGroup>
            </FormControl>
          </FormGroup>
          {question.isAutoChecked && <AnswerList question={question} questionIndex={index} addAnswer={this.props.addAnswer}
            updateAnswer={this.props.updateAnswer} deleteAnswer={this.props.deleteAnswer} errors={errors}/>}
          <TextField label={question.isAutoChecked ? 'Punkty za popr. odp.' : 'Max. punktów za to pytanie'} name={'pointsPerCorrectAnswer'}
            value={question.pointsPerCorrectAnswer} onChange={this.handleChange} error={get(errors, `questions[${index}].pointsPerCorrectAnswer`, false)}
            helperText={get(errors, `questions[${index}].pointsPerCorrectAnswer`, '')}/>
          {question.isAutoChecked && <TextField label={'Komunikat po popr. odp.'} name={'messageAfterCorrectAnswer'}
            value={question.messageAfterCorrectAnswer} onChange={this.handleChange}/>}
          <TextField label={question.isAutoChecked ? 'Punkty za niepopr. odp.' : 'Min. punktów za to pytanie'} name={'pointsPerIncorrectAnswer'}
            value={question.pointsPerIncorrectAnswer} onChange={this.handleChange} error={get(errors, `questions[${index}].pointsPerIncorrectAnswer`, false)}
            helperText={get(errors, `questions[${index}].pointsPerIncorrectAnswer`, '')}/>
          {question.isAutoChecked && <TextField label={'Komunikat po niepopr. odp.'} name={'messageAfterIncorrectAnswer'}
            value={question.messageAfterIncorrectAnswer} onChange={this.handleChange}/>}
          <Button onClick={this.handleDelete}>Usuń to pytanie</Button>
        </FormGroup>
      </>
    );
  }
}

export default AdventureQuestionForm;
