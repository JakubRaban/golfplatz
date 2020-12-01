import React from 'react';
import {InputLabel, TextField, Typography} from '@material-ui/core';
import {get} from 'lodash';

export class PlotPart extends React.Component {
  render() {
    const {plotPart, errors, index} = this.props;

    return (
      <div key={this.props.index}>
        <Typography variant="subtitle2" gutterBottom>
          {index + 1} część fabuły.
        </Typography>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Nazwa:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={plotPart.name} type="text"
              error={get(errors, `plotParts[${index}].name`, false)} name="name"
              helperText={get(errors, `plotParts[${index}].name`, '')} variant="outlined"
              onChange={(e) => this.props.handleChange('name', index, e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Krótki opis:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={plotPart.introduction} name="introduction"
              error={get(errors, `plotParts[${index}].introduction`, false)} type="text"
              helperText={get(errors, `plotParts[${index}].introduction`, '')} variant="outlined"
              onChange={() => this.props.handleChange('introduction', index, event.target.value)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default PlotPart;
