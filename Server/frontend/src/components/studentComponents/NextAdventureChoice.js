import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


export class NextAdventureChoice extends Component {
  render() {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          {this.props.adventurePart.choice.choiceDescription}
        </Typography>
        {this.props.adventurePart.choice.pathChoices.map(pathChoice => (
          <Button variant="contained" onClick={this.props.onSubmit(pathChoice.toAdventure)}>
            {pathChoice.pathDescription}
          </Button>
        ))}
      </div>
    )
  }
}

export default connect(null)(NextAdventureChoice);