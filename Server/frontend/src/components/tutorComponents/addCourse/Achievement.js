import '../../../styles/course-forms.css';

import { Accordion, AccordionDetails, AccordionSummary, Button, FormHelperText, InputLabel,
   MenuItem, Select, TextField, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Component } from 'react';
import { get } from 'lodash';

export class AddAchievement extends Component {
  handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.props.handleChange('image', this.props.index, reader.result);
    };
    reader.readAsDataURL(file);
  }

  handleSelect = (e) => {
    this.props.handleChange(e.target.name, this.props.index, e.target.value);
  }

  render() {
    const { achievement, errors, index } = this.props;
    return (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant='subtitle1'>{achievement.name || 'Rozwiń panel'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='achievements-wrapper'>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Podaj nazwę odznaki:</InputLabel>
              </div>
              <div className="col-75">
              <TextField className="input-class" value={achievement.name} variant="outlined"
                error={get(errors, `achievements[${index}].name`, false)} name="name"
                helperText={get(errors, `achievements[${index}].name`, '')} type="text"
                onChange={(e) => this.props.handleChange('name', index, e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Dodaj obrazek odznaki:</InputLabel>
              </div>
              <div className="col-75">
                <input type="file" name="image" accept="image/*" onChange={this.handleImage}/>
                {get(errors, `achievements[${index}].image`, false) && 
                  <FormHelperText error>{errors.achievements[index].image}</FormHelperText>}
              </div>
            </div>
            <div className="row">
              <div className="col-50">
                <InputLabel className="label-class">Podaj jakiego elementu kursu dotyczy odznaka:</InputLabel>
              </div>
              <div className="col-50">
                <Select name={'courseElementConsidered'} value={achievement.courseElementConsidered}
                  onChange={this.handleSelect}>
                  <MenuItem value={'NOT SELECTED'}>(wybierz)</MenuItem>
                  <MenuItem value={'PLOT_PART'}>Części fabuły</MenuItem>
                  <MenuItem value={'CHAPTER'}>Rozdziału</MenuItem>
                </Select>
                {get(errors, `achievements[${index}].courseElementConsidered`, false) && 
                  <FormHelperText error>{errors.achievements[index].courseElementConsidered}</FormHelperText>}
              </div>
            </div>
            <div className="row">
              <div className="col-65">
                <InputLabel className="label-class">Podaj liczbę elementów wymaganych do otrzymania odznaki, określ czy muszą wystąpić pod rząd:</InputLabel>
              </div>
              <div className="col-25">
                <TextField className="input-class" value={achievement.howMany} variant="outlined"
                  error={get(errors, `achievements[${index}].howMany`, false)} name="howMany"
                  helperText={get(errors, `achievements[${index}].howMany`, '')} type="number"
                  onChange={(e) => this.props.handleChange('howMany', index, e.target.value)} />
              </div>
              <div className="col-10">
                <input value={achievement.inARow} type="checkbox"
                  name="inARow" onChange={(e) => this.props.handleChange('inARow', index, e.target.checked)}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Podaj typ sprawdzanego warunku:</InputLabel>
              </div>
              <div className="col-75">
                <Select name={'conditionType'} value={achievement.conditionType}
                  onChange={this.handleSelect}>
                  <MenuItem value={'NOT SELECTED'}>(wybierz)</MenuItem>
                  <MenuItem value={'TIME'}>Czas</MenuItem>
                  <MenuItem value={'SCORE'}>Liczba punktów</MenuItem>
                </Select>
                {get(errors, `achievements[${index}].conditionType`, false) && 
                  <FormHelperText error>{errors.achievements[index].conditionType}</FormHelperText>}
              </div>
            </div>
            <div className="row">
              <div className="col-50">
                <InputLabel className="label-class">Podaj minimalny wynik procentowy wymagany do zdobycia tej odznaki:</InputLabel>
              </div>
              <div className="col-50">
                <TextField className="input-class" value={achievement.percentage} variant="outlined"
                  error={get(errors, `achievements[${index}].percentage`, false)} name="percentage"
                  helperText={get(errors, `achievements[${index}].percentage`, '')} type="number"
                  onChange={(e) => this.props.handleChange('percentage', index, e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-50">
                <InputLabel className="label-class">Jakie kategorie przygód uwzględniać przy sprawdzaniu odznaki?</InputLabel>
              </div>
              <div className="col-50">
                <Select name={'adventureCategoryIncluded'} value={achievement.adventureCategoryIncluded}
                  onChange={this.handleSelect}>
                  <MenuItem value={'ALL'}>Wszystkie</MenuItem>
                  <MenuItem value={'QUIZ'}>Kartkówki</MenuItem>
                  <MenuItem value={'GENERIC'}>Zadania na zajęciach</MenuItem>
                  <MenuItem value={'ACTIVENESS'}>Aktywność</MenuItem>
                  <MenuItem value={'TEST'}>Kolokwia</MenuItem>
                  <MenuItem value={'HOMEWORK'}>Prace domowe</MenuItem>
                </Select>
                {get(errors, `achievements[${index}].conditionType`, false) &&
                  <FormHelperText error>{errors.achievements[index].conditionType}</FormHelperText>}
              </div>
            </div>
            <div style={{ float: 'right', marginBottom: '10px', marginRight: '5px' }}>
              <Button
                color='secondary'
                onClick={() => this.props.removeAchievement(index)}
              >Usuń tę odznakę</Button>
            </div>
          </div>

        </AccordionDetails>
      </Accordion>
    );
  }
}

export default AddAchievement;
