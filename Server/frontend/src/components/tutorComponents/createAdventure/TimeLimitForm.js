import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';

class TimeLimitForm extends React.Component {
  handleHasTimeLimitChange = (e) => {
    this.props.setHasTimeLimit(e.target.checked);
  }

  handleTimeLimitChange = (e) => {
    const parsedNumber = parseInt(e.target.value, 10);
    this.props.setTimeLimit(isNaN(parsedNumber) ? 0 : parsedNumber);
  }

  render() {
    return (
      <>
        <FormControlLabel control={<Switch checked={this.props.hasTimeLimit} onChange={this.handleHasTimeLimitChange}/>}
          label={`Ustal maksymalny czas na ukończenie przygody ${this.props.hasTimeLimit ? 'na: ' : ''}`}/>
        {this.props.hasTimeLimit &&
          <TextField id={'standard-basic'} label={'Czas w sekundach'} value={this.props.timeLimit} onChange={this.handleTimeLimitChange}/>
        }
      </>
    );
  }
}

export default TimeLimitForm;