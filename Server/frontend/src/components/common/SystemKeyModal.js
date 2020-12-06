import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import React from 'react';

class SystemKeyModal extends React.Component {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <DialogTitle id='alert-dialog-title'>Klucz rejestracji kolejnych prowadzących:</DialogTitle>
        <DialogContent>
          <Typography variant='subtitle1'>{this.props.systemKey}</Typography>
        </DialogContent>
      </Dialog>
    );
  }
}

export default SystemKeyModal;
    