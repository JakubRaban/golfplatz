import '../../../styles/course-forms.css';

import { Button, FormHelperText, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { get } from 'lodash';

import Rank from './Rank.js';

export class AddRanks extends Component {
  render() {
    return (
      <div style={{ margin: '10px' }}>
        <Typography variant="h6" gutterBottom>
          Konfiguracja rang:
        </Typography>
        {this.props.ranks.map((rank, index) =>
          <Rank
            errors={this.props.errors}
            handleChange={this.props.handleRankChange}
            index={index}
            key={index}
            rank={rank}
          />,
        )}
        <Button
          color="secondary"
          variant='outlined'
          onClick={this.props.addNewRank}
        >Dodaj rangi</Button>
      </div>
    );
  }
}

export default AddRanks;
