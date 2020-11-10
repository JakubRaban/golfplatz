import { Button, Dialog,
  DialogActions,
  DialogTitle } from '@material-ui/core';
import React from 'react';

class DeleteAdventureDialog extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle id="alert-dialog-title">{'Czy na pewno chcesz usunąć przygodę?'}</DialogTitle>
        <DialogActions>
          <Button onClick={this.props.onDelete} color='primary' autoFocus>Tak</Button>
          <Button onClick={this.props.onClose} color='primary' autoFocus>Nie</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DeleteAdventureDialog;
