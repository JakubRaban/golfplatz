import React from 'react';

import { Provider } from 'react-redux';
import store from '../store';
import AddCourse from './AddCourse.js'


class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <p>Long have I waited</p>
        <AddCourse/>
      </Provider>

    );  
  }        
}

export default App;

