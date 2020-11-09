import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import React from 'react';

class TimeLimitForm extends React.Component {
  handleHasTimeLimitChange = (e) => {
    this.props.setHasTimeLimit(e.target.checked);
  }

  handleTimeLimitChange = (e) => {
    console.log(e.target.value)
    this.props.setTimeLimit(e.target.value);
  }

  render() {
    return (
      <>
        <FormControlLabel control={<Switch checked={this.props.hasTimeLimit} onChange={this.handleHasTimeLimitChange}/>}
          label={`Ustal maksymalny czas na ukończenie przygody ${this.props.hasTimeLimit ? 'na: ' : ''}`}/>
        {this.props.hasTimeLimit &&
          <TextField label={'Czas w sekundach'} value={this.props.timeLimit} onChange={this.handleTimeLimitChange}
            error={this.props.errors.timeLimit} helperText={this.props.errors.timeLimit || ''}/>
        }
      </>
    );
  }
}

export default TimeLimitForm;