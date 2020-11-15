import { Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { get } from 'lodash';

class ChoicesList extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.choices !== this.props.choices) {
      this.setState({});
    }
  }

  getAdventureName = (id) => {
    const adventure = this.props.adventures.find((adv) => adv.id === parseInt(id));
    return adventure?.name || '';
  }

  render() {
    const { errors } = this.props;
    
    return (
      <div className='choices-container'>
        <Typography variant='h6'>Opisy przejść</Typography>
        {this.props.choices?.map((choice, index) => {
          return (
            <Accordion key={choice.id} >
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant='subtitle1'>Przejścia</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className='choices-descriptions-wrapper'>
                  <TextField label={'Z przygody'} name={'fromAdventure'} value={this.getAdventureName(choice.fromAdventure)} disabled/>
                  <TextField label={'Opis wyboru przejścia'} multiline rows={4} name={'description'}
                    value={choice.description} error={get(errors, `choices[${index}].description`, false)}
                    helperText={get(errors, `choices[${index}].description`, '')} fullWidth 
                    onChange={() => this.props.handleChange(event.target.value, index)}/>
                  <br/>
                  <Typography variant='subtitle1'>Możliwe przejścia</Typography>
                  {choice.pathChoices.map((pathChoice, nestedIndex) => {
                    return (
                      <React.Fragment key={pathChoice.id}>
                        <TextField label={'Do przygody'} name={'toAdventure'} value={this.getAdventureName(pathChoice.toAdventure)} disabled/>
                        <TextField label={'Opis przejścia'} value={pathChoice.description} name={'description'}
                          error={get(errors, `choices[${index}].pathChoices[${nestedIndex}].description`, false)}
                          helperText={get(errors, `choices[${index}].pathChoices[${nestedIndex}].description`, '')} fullWidth
                          fullWidth onChange={() => this.props.handleChange(event.target.value, index, nestedIndex)}/>
                      </React.Fragment>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

export default ChoicesList;
