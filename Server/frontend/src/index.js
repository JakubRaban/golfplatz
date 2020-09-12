import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import Cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import cxtmenu from 'cytoscape-cxtmenu';

Cytoscape.use(edgehandles);
Cytoscape.use(cxtmenu);
ReactDOM.render(<App />, document.getElementById('app'));
