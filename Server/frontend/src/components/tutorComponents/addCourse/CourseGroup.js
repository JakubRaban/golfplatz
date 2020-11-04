import React from 'react';
import { InputLabel, TextField } from '@material-ui/core';
import { get } from 'lodash'

export class CourseGroup extends React.Component {
  render() {
    const { group, errors, index } = this.props;

    return (
      <div key={index}>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Dzień i godzina zajęć:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={group} type="text" name="groupName" variant="outlined"
              error={get(errors, `groups[${index}]`, false)} helperText={get(errors, `groups[${index}]`, '')} 
              onChange={() => this.props.handleChange(index, event.target.value)} />
          </div>
        </div>
      </div>
    );
  }
}

export default CourseGroup;
