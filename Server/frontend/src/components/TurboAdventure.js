import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { Component } from 'react';

import Graph from './Graph.js';

export class TurboAdventure extends Component {
  state = {
    adventures: [{ id: 1, label: 'xd' }, { id: 2, label: 'Palpatine' }, { id: 3, label: 'Chrzanowskie noce' }, { id: 4, label: 'Wiśniówka' }, { id: 5, label: 'Moda na sukces' }],
    mode: 'text',
  };

  handleChange = (e, mode) => {
    this.setState({ mode });
  }

  render() {
    return (
      <div>
        <h4>Tworzenie przygód w rozdziale</h4>

        <Tabs onChange={this.handleChange}>
          <Tab label='Tryb graficzny' value='graph'/>
          <Tab label='Tryb tekstowy' value='text'/>
        </Tabs>

        {this.state.mode === 'text' ? <div>Text mode </div> : <Graph adventures={this.state.adventures}/>}

      </div>
    );
  }
}

export default TurboAdventure;

