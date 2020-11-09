import '../../../styles/course-forms.css';

import { InputLabel, TextField, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';

export class AddCourseInitialInfo extends Component {
  render() {
    const { values, handleChange } = this.props;

    return (
      <>
        <div style={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
          Wprowadź podstawowe informacje o kursie:
          </Typography>
          <div className="row">
            <div className="col-25">
              <InputLabel className="label-class">Podaj nazwę kursu:</InputLabel>
            </div>
            <div className="col-75">
              <TextField className="input-class" value={values.name} type="text" name="name"
                error={this.props.errors.name} helperText={this.props.errors.name || ''} onChange={handleChange('name')} variant="outlined"/>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <InputLabel className="label-class">Krótko opisz kurs:</InputLabel>
            </div>
            <div className="col-75">
              <TextField className="input-class" value={values.description} type="text" name="description"
                error={this.props.errors.description} helperText={this.props.errors.description || ''}
                multiline rows={3} onChange={handleChange('description')} variant="outlined"/>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(null)(AddCourseInitialInfo);
