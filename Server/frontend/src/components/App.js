import React from 'react';
import { render } from "react-dom";

class App extends React.Component {

  render() {
    return (
      <p>Long have I waited</p>
    );  
  }        
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
