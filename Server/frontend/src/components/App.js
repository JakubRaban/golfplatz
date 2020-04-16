import React from 'react';
import {Provider} from 'react-redux';
import {Switch, Route, HashRouter as Router} from 'react-router-dom';
import store from '../store';
import AddCourse from './AddCourse.js';
import RegisterStudent from './RegisterStudent.js';
import RegisterTutor from './RegisterTutor.js';
import TutorDashboard from './TutorDashboard.js';
import Login from './Login.js';
import {Provider as AlertProvider} from "react-alert"
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./layout/Alerts";
import GetCourses from "./GetCourses";
import Marks from "./Marks";
import PrivateRoute from './PrivateRoute';


const alertOptions = {
  timeout: 3000,
  position: "top center"
};

class App extends React.Component {
  componentDidMount() {

  }


  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Alerts/>
          <p>Long have I waited</p>
          <Router>
            <Switch>
              {/* <Route exact path="/" component={}/> */}
              <PrivateRoute exact path="/tutor-dashboard" component={TutorDashboard}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/add-courses" component={AddCourse}/>
              <Route exact path="/courses" component={GetCourses}/>
              <Route exact path="/register-student" component={RegisterStudent}/>
              <Route exact path="/register-tutor" component={RegisterTutor}/>
              <Route exact path="/marks" component={Marks}/>
            </Switch>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

export default App;

