import '../../../styles/course-forms.css';

import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Select, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Component } from 'react';


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
    const { achievement } = this.props;
    return (
      <Accordion key={this.props.index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant='subtitle1'>{achievement.name || 'Rozwiń panel'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='achievements-wrapper'>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Podaj nazwę odznaki:</label>
              </div>
              <div className="col-75">
                <input className="input-class" value={achievement.name} type="text"
                  name="name" onChange={() => this.props.handleChange('name', this.props.index, event.target.value)}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Dodaj obrazek odznaki:</label>
              </div>
              <div className="col-75">
                <input type="file" name="image" accept="image/*" onChange={this.handleImage}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Podaj jakiego elementu kursu dotyczy odznaka:</label>
              </div>
              <div className="col-75">
                <Select name={'courseElementConsidered'} value={achievement.courseElementConsidered}
                  onChange={this.handleSelect}>
                  <MenuItem value={'NOT SELECTED'}>(wybierz)</MenuItem>
                  <MenuItem value={'PLOT_PART'}>Części fabuły</MenuItem>
                  <MenuItem value={'CHAPTER'}>Rozdziału</MenuItem>
                </Select>
              </div>
            </div>
            <div className="row">
              <div className="col-50">
                <label className="label-class">Podaj liczbę elementów wymaganych do otrzymania odznaki, określ czy muszą wystąpić pod rząd:</label>
              </div>
              <div className="col-25">
                <input className="input-class" value={achievement.howMany} type="number"
                  name="howMany" onChange={() => this.props.handleChange('howMany', this.props.index, event.target.value)}/>
              </div>
              <div className="col-25">
                <input value={achievement.inARow} type="checkbox"
                  name="inARow" onChange={() => this.props.handleChange('inARow', this.props.index, event.target.checked)}/>
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <label className="label-class">Podaj typ sprawdzanego warunku:</label>
              </div>
              <div className="col-75">
                <Select name={'conditionType'} value={achievement.conditionType}
                  onChange={this.handleSelect}>
                  <MenuItem value={'NOT SELECTED'}>(wybierz)</MenuItem>
                  <MenuItem value={'TIME'}>Czas</MenuItem>
                  <MenuItem value={'SCORE'}>Liczba punktów</MenuItem>
                </Select>
              </div>
            </div>
            <div className="row">
              <div className="col-50">
                <label className="label-class">Podaj minimalny wynik procentowy wymagany do zdobycia tej odznaki:</label>
              </div>
              <div className="col-50">
                <input className="input-class" value={achievement.percentage} type="number"
                  name="percentage" onChange={() => this.props.handleChange('percentage', this.props.index, event.target.value)}/>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default AddAchievement;
