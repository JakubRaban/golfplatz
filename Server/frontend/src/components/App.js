import React from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';
import AddCourse from './AddCourse.js';
import RegisterStudent from './RegisterStudent.js';
import RegisterTutor from './RegisterTutor.js';


class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={AddCourse} />
            <Route exact path="/register-student" component={RegisterStudent} />
            <Route exact path="/register-tutor" component={RegisterTutor} />
          </Switch>
        </Router>
      </Provider>

    );  
  }        
}

export default App;

