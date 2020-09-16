import Cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import edgehandles from 'cytoscape-edgehandles';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';

Cytoscape.use(edgehandles);
Cytoscape.use(cxtmenu);
ReactDOM.render(<App />, document.getElementById('app'));
