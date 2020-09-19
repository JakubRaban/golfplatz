import React from 'react';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { loadUser } from '../actions/auth.js';
import store, { persistor } from '../store.js';
import Login from './authentication/Login.js';
import RegisterStudent from './authentication/RegisterStudent.js';
import RegisterTutor from './authentication/RegisterTutor.js';
import Alerts from './layout/Alerts.js';
import PrivateRoute from './PrivateRoute.js';
import Achievements from './studentComponents/Achievements.js';
import ChapterPassing from './studentComponents/ChapterPassing.js';
import GameCard from './studentComponents/GameCard.js';
import Ranking from './studentComponents/Ranking.js';
import StudentDashboard from './studentComponents/StudentDashboard.js';
import StudentMarks from './studentComponents/StudentMarks.js';
import TurboAdventure from './TurboAdventure.js';
import AddCourse from './tutorComponents/AddCourse.js';
import Chapter from './tutorComponents/Chapter.js';
import CourseDetails from './tutorComponents/CourseDetails.js';
import GetCourses from './tutorComponents/GetCourses.js';
import Marks from './tutorComponents/Marks.js';
import TutorDashboard from './tutorComponents/TutorDashboard.js';
import Adventure from './tutorComponents/createAdventure/Adventure.js';

const alertOptions = {
  timeout: 3000,
  position: 'top center',
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
                <Route exact path="/open-chapter/:id" component = {ChapterPassing}/>
                <Route exact path="/graph" component = {TurboAdventure} />
                <Route exact path="/adventure" component = {Adventure}/>
              </Switch>
            </Router>
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

