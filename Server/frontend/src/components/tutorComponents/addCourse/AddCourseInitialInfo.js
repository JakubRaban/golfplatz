import '../../../styles/course-forms.css';

import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { connect } from 'react-redux';


export class AddCourseInitialInfo extends Component {
  render() {
    const { values, handleChange } = this.props;

    return (
      <React.Fragment>
        <div style={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
          Wprowadź podstawowe informacje o kursie:
          </Typography>
          <div className="row">
            <div className="col-25">
              <label className="label-class">Podaj nazwę kursu:</label>
            </div>
            <div className="col-75">
              <input className="input-class" value={values.name} type="text"
                name="name" onChange={handleChange('name')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class">Krótko opisz kurs:</label>
            </div>
            <div className="col-75">
              <textarea className="input-class" value={values.description} type="text"
                name="description" onChange={handleChange('description')}/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null)(AddCourseInitialInfo);
