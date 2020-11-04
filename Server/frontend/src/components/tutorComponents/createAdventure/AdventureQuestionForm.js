
import { Button, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Switch, TextField } from '@material-ui/core';
import React from 'react';

import AnswerList from './AnswerList.js';

class AdventureQuestionForm extends React.Component {
  handleChange = (e) => {
    const index = this.props.index;
    if (e.target.name === 'isAutoChecked') {
      if (e.target.checked) {
        this.props.updateQuestion(index, {
          inputType: this.props.question.inputType === 'IMAGE' ? 'TEXTFIELD' : this.props.question.inputType
        });
      } else {
        this.props.updateQuestion(index, { questionType: 'OPEN', answers: [] });
      }
    } else if (e.target.name === 'questionType' && e.target.value === 'CLOSED') {
      this.props.updateQuestion(index, {
        isAutoChecked: true,
        inputType: this.props.question.inputType === 'IMAGE' ? 'TEXTFIELD' : this.props.question.inputType
      })
    } else if (e.target.name === 'inputType' && e.target.value === 'IMAGE') {
      this.props.updateQuestion(index, { questionType: 'OPEN', isAutoChecked: false, answers: [] });
    }
    this.props.updateQuestion(index, { [e.target.name]: e.target.name === 'isAutoChecked' ? e.target.checked : e.target.value });
  }

  handleDelete = () => {
    this.props.deleteQuestion(this.props.index);
  }

  render() {
    const { question } = this.props;
    return (
      <>
        <div>Pytanie {this.props.index + 1}</div>
        <FormGroup>
          <TextField label={'Treść pytania'} name={'text'} value={question.text} onChange={this.handleChange}/>
          <FormControlLabel control={<Switch checked={question.isAutoChecked} name={'isAutoChecked'} onChange={this.handleChange}/>} label={'Sprawdzane automatycznie'} />
          <FormGroup row>
            <FormControl component={'fieldset'}>
              <FormLabel component={'legend'}>Rodzaj pytania</FormLabel>
              <RadioGroup name={'questionType'} value={question.questionType} onChange={this.handleChange}>
                <FormControlLabel control={<Radio/>} label={'Zamknięte'} value={'CLOSED'}/>
                <FormControlLabel control={<Radio/>} label={'Otwarte'} value={'OPEN'}/>
              </RadioGroup>
            </FormControl>
            <FormControl component={'fieldset'}>
              <FormLabel component={'legend'}>Typ odpowiedzi</FormLabel>
              <RadioGroup name={'inputType'} value={question.inputType} onChange={this.handleChange}>
                <FormControlLabel control={<Radio/>} label={'Krótki tekst'} value={'TEXTFIELD'}/>
                <FormControlLabel control={<Radio/>} label={'Wielolinijkowy tekst'} value={'TEXTAREA'}/>
                <FormControlLabel control={<Radio/>} label={'Grafika'} value={'IMAGE'}/>
              </RadioGroup>
            </FormControl>
          </FormGroup>
          {question.isAutoChecked && <AnswerList question={question} questionIndex={this.props.index} addAnswer={this.props.addAnswer}
            updateAnswer={this.props.updateAnswer} deleteAnswer={this.props.deleteAnswer}/>}
          <TextField label={question.isAutoChecked ? 'Punkty za popr. odp.' : 'Max. punktów za to pytanie'} name={'pointsPerCorrectAnswer'}
            value={question.pointsPerCorrectAnswer} onChange={this.handleChange}/>
          {question.isAutoChecked && <TextField label={'Komunikat po popr. odp.'} name={'messageAfterCorrectAnswer'}
            value={question.messageAfterCorrectAnswer} onChange={this.handleChange}/>}
          <TextField label={question.isAutoChecked ? 'Punkty za niepopr. odp.' : 'Min. punktów za to pytanie'} name={'pointsPerIncorrectAnswer'}
            value={question.pointsPerIncorrectAnswer} onChange={this.handleChange}/>
          {question.isAutoChecked && <TextField label={'Komunikat po niepopr. odp.'} name={'messageAfterIncorrectAnswer'}
            value={question.messageAfterIncorrectAnswer} onChange={this.handleChange}/>}
          <Button onClick={this.handleDelete}>Usuń to pytanie</Button>
        </FormGroup>
      </>
    );
  }
}

export default AdventureQuestionForm;
