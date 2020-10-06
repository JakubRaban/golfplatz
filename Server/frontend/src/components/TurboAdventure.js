import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { Component } from 'react';

import AdventuresList from './AdventuresList.js';
import Graph from './Graph.js';

export class TurboAdventure extends Component {
  state = {
    adventures: [{ id: 1, name: 'xd' }, { id: 2, name: 'Palpatine' }, { id: 3, name: 'Chrzanowskie noce' }, { id: 4, name: 'Wiśniówka' }, { id: 5, name: 'Moda na sukces' }],
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
          <Tab label='Lista przygód' value='text'/>
          <Tab label='Tworzenie powiązań' value='graph'/>
        </Tabs>

        {this.state.mode === 'text' ? <AdventuresList adventures={this.state.adventures}/> : <Graph adventures={this.state.adventures}/>}

      </div>
    );
  }
}

export default TurboAdventure;

