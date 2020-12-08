import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React from 'react';

class EnrollDialog extends React.Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id='alert-dialog-title'>Podaj klucz do zapisu:</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='8-cyfrowy kod grupy'
            onChange={this.props.onChange}
            value={this.props.enrollCode}
            variant='standard'
          />
          <Button onClick={this.props.onEnrollCodeSubmit}>Zapisz się!</Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default EnrollDialog;
    