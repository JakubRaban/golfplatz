
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React from 'react';

class AdventureBasicDataForm extends React.Component {
  handleChange = (e) => {
    this.props.updateForm({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <form>
        <TextField label={'Nazwa przygody'} id={'standard-basic'} name={'name'} value={this.props.adventure.name} onChange={this.handleChange} />
        <TextField label={'Opis przygody'} id={'standard-multiline-flexible'} name={'description'} value={this.props.adventure.description} onChange={this.handleChange} />
        <FormControl>
          <InputLabel id={'category-label'}>Kategoria przygody</InputLabel>
          <Select labelId={'category-label'} name={'category'} value={this.props.adventure.category} onChange={this.handleChange}>
            <MenuItem value={'QUIZ'}>Kartkówka</MenuItem>
            <MenuItem value={'GENERIC'}>Zadanie na zajęciach</MenuItem>
            <MenuItem value={'ACTIVENESS'}>Aktywność</MenuItem>
            <MenuItem value={'TEST'}>Kolokwium</MenuItem>
            <MenuItem value={'HOMEWORK'}>Praca domowa</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default AdventureBasicDataForm;
