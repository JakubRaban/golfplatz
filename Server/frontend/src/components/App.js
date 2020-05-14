import React from 'react';
import {Provider} from 'react-redux';
import {Switch, Route, HashRouter as Router} from 'react-router-dom';
import store from '../store';
import {persistor} from '../store';
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
import Ranking from "./studentComponents/Ranking";
import Achievements from "./studentComponents/Achievements";
import GameCard from "./studentComponents/GameCard";
import StudentMarks from "./studentComponents/StudentMarks";
import PrivateRoute from './PrivateRoute';
import { loadUser } from '../actions/auth';
import CourseDetails from './tutorComponents/CourseDetails';
import Chapter from './tutorComponents/Chapter';
import StudentDashboard from './studentComponents/StudentDashboard';
import { PersistGate } from 'redux-persist/integration/react'


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
        <PersistGate loading={null} persistor={persistor}>
          <AlertProvider template={AlertTemplate} {...alertOptions}>
            <Alerts/>
            <Router>
              <Switch>
                <PrivateRoute exact path="/" component={TutorDashboard}/>
                <Route exact path="/student" component = {StudentDashboard}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/add-courses" component={AddCourse}/>
                <Route exact path="/courses" component={GetCourses}/>
                <Route exact path="/courses/:id" component={CourseDetails}/>
                <Route exact path="/chapters/:id" component={Chapter}/>  
                <Route exact path="/register-student" component={RegisterStudent}/>
                <Route exact path="/register-tutor" component={RegisterTutor}/>
                <Route exact path="/marks" component={Marks}/>
                <Route exact path="/game-card" component = {GameCard}/>
                <Route exact path="/ranking" component = {Ranking}/>
                <Route exact path="/achievements" component = {Achievements}/>
                <Route exact path="/student-marks" component = {StudentMarks}/>
              </Switch>
            </Router>
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

