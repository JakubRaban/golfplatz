import React from 'react';
import {Provider} from 'react-redux';
import {Switch, Route, HashRouter as Router} from 'react-router-dom';
import store from '../store';
import AddCourse from './tutorComponents/AddCourse.js';
import RegisterStudent from './authentication/RegisterStudent.js';
import RegisterTutor from './authentication/RegisterTutor.js';
import TutorDashboard from './tutorComponents/TutorDashboard.js';
import Login from './authentication/Login.js';
import {Provider as AlertProvider} from "react-alert"
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./layout/Alerts";
import GetCourses from "./GetCourses";
import Marks from "./tutorComponents/Marks";
import PrivateRoute from './PrivateRoute';
import { loadUser } from '../actions/auth';


const alertOptions = {
  timeout: 3000,
  position: "top center"
};

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
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
              <PrivateRoute exact path="/" component={TutorDashboard}/>
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

