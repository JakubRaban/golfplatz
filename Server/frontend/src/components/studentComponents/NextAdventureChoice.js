import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { connect } from 'react-redux';


export class NextAdventureChoice extends Component {
  render() {

    return (
      <>
        <Typography variant='h5' gutterBottom>
          {this.props.adventurePart.chapterName}
        </Typography>
        <div style={{ marginLeft: '5px' }}>
          <Typography variant='subtitle1' gutterBottom>
            {this.props.adventurePart.choice.description}
          </Typography>
          {this.props.adventurePart.choice.pathChoices.map((pathChoice, i) =>
            <div style={{ display: 'inlineBlock', margin: '10px' }}>
              <Button key={i} variant='contained' onClick={this.props.onSubmit(pathChoice.toAdventure)}>
                {pathChoice.description}
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default connect(null)(NextAdventureChoice);
