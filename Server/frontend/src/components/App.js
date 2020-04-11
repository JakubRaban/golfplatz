import React from 'react';

import {Provider} from 'react-redux';
import store from '../store';
import AddCourse from './AddCourse.js'

import {Provider as AlertProvider} from "react-alert"
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./layout/Alerts";
import GetCourses from "./GetCourses";

const alertOptions = {
  timeout: 3000,
  position: "top center"
};

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Alerts/>
          <p>Long have I waited</p>
          <GetCourses/>
          <AddCourse/>
        </AlertProvider>
      </Provider>

    );
  }
}

export default App;

