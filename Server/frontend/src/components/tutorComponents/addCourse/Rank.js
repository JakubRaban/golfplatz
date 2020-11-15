import '../../../styles/course-forms.css';

import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, 
  FormHelperText, InputLabel, TextField, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { get } from 'lodash';

export class Rank extends React.Component {
  handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.props.handleChange('image', this.props.index, reader.result);
    };
    reader.readAsDataURL(file);
  }

  render() {
    const { rank, errors, index } = this.props;

    return (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography variant='subtitle1'>{rank.name || 'Rozwiń panel'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='ranks-wrapper'>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Nazwa:</InputLabel>
              </div>
              <div className="col-75">
                <TextField className="input-class" value={rank.name} type="text" 
                  error={get(errors, `ranks[${index}].name`, false)} name="name"
                  helperText={get(errors, `ranks[${index}].name`, '')} variant="outlined"
                  onChange={() => this.props.handleChange('name', index, event.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Dodaj obrazek rangi:</InputLabel>
              </div>
              <div className="col-75">
                <input type="file" name="image" accept="image/*" onChange={this.handleImage}/>
                {get(errors, `ranks[${index}].image`, false) && 
                  <FormHelperText error>{errors.ranks[index].image}</FormHelperText>}
              </div>
            </div>
            <div className="row">
              <div className="col-25">
                <InputLabel className="label-class">Dolny próg punktowy:</InputLabel>
              </div>
              <div className="col-75">
                <TextField className="input-class" value={rank.lowerThresholdPercent} type="text" 
                  error={get(errors, `ranks[${index}].lowerThresholdPercent`, false)} name="lowerThresholdPercent"
                  helperText={get(errors, `ranks[${index}].lowerThresholdPercent`, '')} variant="outlined" type="number"
                  onChange={() => this.props.handleChange('lowerThresholdPercent', index, event.target.value)} />
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default Rank;
