import '../../../styles/course-forms.css';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';

import CourseGroup from './CourseGroup.js';
import PlotPart from './PlotPart.js';

export class AddGroupsAndPlot extends Component {

  render() {
    return (
      <>
        <div style={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
            Napisz kiedy odbywają się zajęcia
          </Typography>
          {this.props.groups.map((group, index) =>
            <CourseGroup
              group={group}
              handleChange={this.props.handleGroupChange}
              index={index}
              key={index} />,
          )}
          <Button
            color="secondary"
            variant='outlined'
            onClick={this.props.addNewCourseGroup}
          >Dodaj kolejny termin zajęć</Button>
        </div>
        <div style={{ margin: '10px' }}>
          <Typography variant="h6" gutterBottom>
            Dodaj części fabuły do kursu
          </Typography>
          {this.props.plotParts.map((plotPart, index) =>
            <PlotPart
              handleChange={this.props.handlePlotPartChange}
              index={index}
              key={index}
              plotPart={plotPart}
            />,
          )}        
          <Button
            color="secondary"
            variant='outlined'
            onClick={this.props.addNewPlotPart}
          >Dodaj kolejną część fabuły
          </Button>           
        </div>
      </>
    );
  }
}

export default AddGroupsAndPlot;
