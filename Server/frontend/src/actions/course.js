import axios from 'axios';

import { ADD_COURSE, GET_ERRORS, GET_COURSES, CREATE_MESSAGE } from './types.js';
import {createMessage, returnErrors} from "./messages";

export const addCourse = course => dispatch => {
  axios.post("/api/courses/", course).then(res => {
    dispatch(createMessage({courseAdded: "Course successfully created"}));
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
};

export const getCourses = () => dispatch => {
  axios.get("/api/courses/").then(res => {
    dispatch({
      type: GET_COURSES,
      payload: res.data
    })
  })
};