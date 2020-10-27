import { Dialog,
  DialogContent,
  DialogTitle, List, ListItem, ListItemText } from '@material-ui/core';
import React from 'react';

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

class ChooseCourseDialog extends React.Component {
  render() {
    console.log(this.props);

    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id='alert-dialog-title'>{'Wybierz kurs, którego kartę gry chcesz zobaczyć'}</DialogTitle>
        <DialogContent>
          <List component='nav' aria-label='secondary courses'>
            {this.props.courses.map((course) =>
              <ListItemLink key={course.id} href={`/#/game-card/${course.id}`}>
                <ListItemText primary={course.name} />
              </ListItemLink>
            )}
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}

export default ChooseCourseDialog;
  