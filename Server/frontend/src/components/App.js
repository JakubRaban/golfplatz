import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import { loadUser } from '../actions/auth.js';
import store, { persistor } from '../store.js';
import Login from './authentication/Login.js';
import RegisterStudent from './authentication/RegisterStudent.js';
import RegisterTutor from './authentication/RegisterTutor.js';
import PrivateRoute from './PrivateRoute.js';
import ChapterPassing from './studentComponents/ChapterPassing.js';
import GameCard from './studentComponents/GameCard.js';
import Ranking from './studentComponents/Ranking.js';
import StudentDashboard from './studentComponents/StudentDashboard.js';
import TurboAdventure from './TurboAdventure.js';
import AddCourse from './tutorComponents/addCourse/AddCourse.js';
import CourseDetails from './tutorComponents/CourseDetails.js';
import Adventure from './tutorComponents/createAdventure/Adventure.js';
import GetCourses from './tutorComponents/GetCourses.js';
import Marks from './tutorComponents/Marks.js';
import TutorDashboard from './tutorComponents/TutorDashboard.js';

class App extends React.Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <ToastContainer />
            <Switch>
              <PrivateRoute exact path="/" component={TutorDashboard}/>
              <Route exact path="/student" component = {StudentDashboard}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/add-courses" component={AddCourse}/>
              <Route exact path="/courses" component={GetCourses}/>
              <Route exact path="/courses/:id" component={CourseDetails}/>
              <Route exact path="/chapters/:id" component = {TurboAdventure} />
              <Route exact path="/adventure/add" component = {Adventure}/>
              <Route exact path="/adventure/:id" render={(props) => <Adventure {...props}/>}/>
              <Route exact path="/register-student" component={RegisterStudent}/>
              <Route exact path="/register-tutor" component={RegisterTutor}/>
              <Route exact path="/marks" component={Marks}/>
              <Route exact path="/game-card/:id" component = {GameCard}/>
              <Route exact path="/ranking" component = {Ranking}/>
              <Route exact path="/open-chapter/:id" component = {ChapterPassing}/>
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

