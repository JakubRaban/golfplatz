
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Switch, TextField } from '@material-ui/core';
import React from 'react';

class AdventureQuestionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props.emptyQuestion };
  }

  handleChange = (e) => {
    const stateUpdateCallback = () => this.props.updateQuestion(this.props.index, { ...this.state });
    if (e.target.name === 'isAutoChecked') this.setState({ 'isAutoChecked': e.target.checked }, stateUpdateCallback);
    else this.setState({ [e.target.name]: e.target.value }, stateUpdateCallback);
  }

  handleDelete = () => {
    console.log('TODO');
  }

  render() {
    return (
      <>
        <div>Pytanie {this.props.index + 1}</div>
        <form>
          <TextField id={'standard-basic'} label={'Treść pytania'} name={'text'} value={this.state.text} onChange={this.handleChange}/>
          <FormControlLabel control={<Switch checked={this.state.isAutoChecked} name={'isAutoChecked'} onChange={this.handleChange}/>} label={'Sprawdzane automatycznie'} />
          <FormControl component={'fieldset'}>
            <FormLabel component={'legend'}>Rodzaj pytania</FormLabel>
            <RadioGroup name={'questionType'} value={this.state.questionType} onChange={this.handleChange}>
              <FormControlLabel control={<Radio />} label={'Zamknięte'} value={'CLOSED'} />
              <FormControlLabel control={<Radio />} label={'Otwarte'} value={'OPEN'} />
            </RadioGroup>
          </FormControl>
          <FormControl component={'fieldset'}>
            <FormLabel component={'legend'}>Typ odpowiedzi</FormLabel>
            <RadioGroup name={'inputType'} value={this.state.inputType} onChange={this.handleChange}>
              <FormControlLabel control={<Radio />} label={'Krótka'} value={'TEXTFIELD'} />
              <FormControlLabel control={<Radio />} label={'Wielolinijkowa'} value={'TEXTAREA'} />
            </RadioGroup>
          </FormControl>
          {/* <ChoiceList questionType={this.state.questionType} />*/}
          <TextField id={'standard-basic'} label={'Punkty za popr. odp.'} name={'pointsPerCorrectAnswer'}
            value={this.state.pointsPerCorrectAnswer} onChange={this.handleChange}/>
          <TextField id={'standard-basic'} label={'Komunikat po popr. odp.'} name={'messageAfterCorrectAnswer'}
            value={this.state.messageAfterCorrectAnswer} onChange={this.handleChange}/>
          <TextField id={'standard-basic'} label={'Punkty za niepopr. odp.'} name={'pointsPerIncorrectAnswer'}
            value={this.state.pointsPerIncorrectAnswer} onChange={this.handleChange}/>
          <TextField id={'standard-basic'} label={'Komunikat po niepopr. odp.'} name={'messageAfterIncorrectAnswer'}
            value={this.state.messageAfterIncorrectAnswer} onChange={this.handleChange}/>
          <Button onClick={this.handleDelete}>Usuń to pytanie</Button>
        </form>
      </>
    );
  }
}

export default AdventureQuestionForm;
