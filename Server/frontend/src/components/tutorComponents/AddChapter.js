import React from 'react';
import { InputLabel, TextField, Typography } from '@material-ui/core';
import { get } from 'lodash';

export class AddChapter extends React.Component {
  render() {
    const { chapter, errors, index } = this.props;

    return (
      <div key={this.props.index}>
        <Typography variant="subtitle2" gutterBottom>
          {index + 1} dodawany rozdział.
        </Typography>
        <div className="row">
            <div className="col-25">
              <InputLabel className="label-class">Nazwa:</InputLabel>
            </div>
            <div className="col-75">
              <TextField className="input-class" value={chapter.name} type="text" 
                error={get(errors, `chapters[${index}].name`, false)} name="name"
                helperText={get(errors, `chapters[${index}].name`, '')} variant="outlined"
                onChange={(e) => this.props.handleChange('name', index, e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <InputLabel className="label-class">Krótki opis:</InputLabel>
            </div>
            <div className="col-75">
              <TextField className="input-class" value={chapter.description} name="description" 
                error={get(errors, `chapters[${index}].description`, false)} type="text"
                helperText={get(errors, `chapters[${index}].description`, '')} variant="outlined"
                onChange={(e) => this.props.handleChange('description', index, e.target.value)} />
            </div>
          </div>
      </div>
    );
  }
}

export default AddChapter;
