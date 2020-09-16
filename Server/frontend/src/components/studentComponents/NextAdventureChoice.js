import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { connect } from 'react-redux';


export class NextAdventureChoice extends Component {
  render() {
    return (
      <div>
        <Typography variant="subtitle1" gutterBottom>
          {this.props.adventurePart.choice.choiceDescription}
        </Typography>
        {this.props.adventurePart.choice.pathChoices.map((pathChoice, i) =>
          <Button key={i} variant="contained" onClick={this.props.onSubmit(pathChoice.toAdventure)}>
            {pathChoice.pathDescription}
          </Button>,
        )}
      </div>
    );
  }
}

export default connect(null)(NextAdventureChoice);
