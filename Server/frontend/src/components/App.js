import React from 'react';
import { render } from "react-dom";

import { Provider } from 'react-redux';
import store from '../store';


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

const container = document.getElementById("app");
render(<App />, container);
