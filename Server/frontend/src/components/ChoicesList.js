import { Accordion,
  AccordionDetails,
  AccordionSummary,
  FormGroup,
  TextField,
  Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

class ChoicesList extends React.Component {
  getAdventureName = (id) => {
    const adventure = this.props.adventures.find((adv) => adv.id === id);
    return adventure.name;
  }

  render() {
    console.log(this.props);
    return (
      <div className='choices-container'>
        <Typography variant='h6'>Opisy przejść</Typography>
        {this.props.choices?.map((choice) => {
          return (
            <Accordion key={choice.id} >
              <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography variant='subtitle1'>Przejścia</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormGroup style={{ marginBottom: '5px' }}>
                  <TextField label={'Z przygody'} name={'fromAdventure'} value={this.getAdventureName(choice.fromAdventure)} disabled/>
                  <TextField label={'Opis wyboru przejścia'} multiline rows={4} name={'description'} value={choice.description} fullWidth/>
                  <Typography variant='subtitle1'>Możliwe przejścia</Typography>
                  {choice.pathChoices.map((pathChoice) => {
                    return (
                      <>
                        <TextField label={'Do przygody'} name={'toAdventure'} value={this.getAdventureName(pathChoice.toAdventure)} disabled/>
                        <TextField label={'Opis przejścia'} name={'description'} value={pathChoice.description} />
                      </>
                    );
                  })}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

export default ChoicesList;
