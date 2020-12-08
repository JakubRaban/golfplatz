import React from 'react';
import Typography from "@material-ui/core/Typography";
import CourseGroup from "./CourseGroup";
import Button from "@material-ui/core/Button";

class AddGroups extends React.Component {
  render() {
    return (
      <div style={{margin: '10px'}}>
        <Typography variant="h6" gutterBottom>
          Napisz kiedy odbywają się zajęcia:
        </Typography>
        {this.props.groups.map((group, index) =>
          <CourseGroup
            errors={this.props.errors}
            group={group}
            handleChange={this.props.handleGroupChange}
            index={index}
            key={index}/>
        )}
        <Button
          color="secondary"
          variant='outlined'
          onClick={this.props.addNewCourseGroup}
        >Dodaj kolejny termin zajęć</Button>
      </div>
    )
  }
}

export default AddGroups;
