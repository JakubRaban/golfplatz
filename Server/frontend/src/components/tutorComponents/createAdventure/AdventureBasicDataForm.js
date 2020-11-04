
import {FormControl, FormGroup, FormHelperText, InputLabel, MenuItem, Select, TextField} from '@material-ui/core';
import React from 'react';

class AdventureBasicDataForm extends React.Component {
  handleChange = (e) => {
    this.props.updateForm({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <FormGroup>
        <TextField label={'Nazwa przygody'} name={'name'} value={this.props.adventure.name} onChange={this.handleChange}
                   error={this.props.errors.name} helperText={this.props.errors.name || ''}/>
        <TextField label={'Opis przygody'} multiline rows={4} name={'taskDescription'} value={this.props.adventure.taskDescription}
                   onChange={this.handleChange} error={this.props.errors.taskDescription} helperText={this.props.errors.taskDescription || ''}/>
        <FormControl error={this.props.errors.category}>
          <InputLabel id={'category-label'}>Kategoria przygody</InputLabel>
          <Select labelId={'category-label'} name={'category'} value={this.props.adventure.category} onChange={this.handleChange}>
            <MenuItem value={'NOT SELECTED'}>(wybierz)</MenuItem>
            <MenuItem value={'QUIZ'}>Kartkówka</MenuItem>
            <MenuItem value={'GENERIC'}>Zadanie na zajęciach</MenuItem>
            <MenuItem value={'ACTIVENESS'}>Aktywność</MenuItem>
            <MenuItem value={'TEST'}>Kolokwium</MenuItem>
            <MenuItem value={'HOMEWORK'}>Praca domowa</MenuItem>
          </Select>
          {this.props.errors.category && <FormHelperText error>{this.props.errors.category}</FormHelperText>}
        </FormControl>
      </FormGroup>
    );
  }
}

export default AdventureBasicDataForm;
