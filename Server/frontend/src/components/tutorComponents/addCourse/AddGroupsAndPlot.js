import '../../../styles/course-forms.css';

import React, { Component } from 'react';

import AddGroups from "./AddGroups";
import AddPlotParts from "./AddPlotParts";

export class AddGroupsAndPlot extends Component {

  render() {
    return (
      <>
        <AddGroups groups={this.props.groups} errors={this.props.errors} handleGroupChange={this.props.handleGroupChange} addNewCourseGroup={this.props.addNewCourseGroup}/>
        <AddPlotParts plotParts={this.props.plotParts} errors={this.props.errors} handlePlotPartChange={this.props.handlePlotPartChange} addNewPlotPart={this.props.addNewPlotPart} />
      </>
    );
  }
}

export default AddGroupsAndPlot;
