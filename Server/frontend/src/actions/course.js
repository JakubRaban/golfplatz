import axios from 'axios';

import { ADD_COURSE, GET_ERRORS } from './types.js';
import {GET_COURSES} from "./types";

export const addCourse = course => dispatch => {
  axios.post("/api/courses/", course).then(res => {
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
  }).catch(err => {
    const errors = {
      msg: err.response.data,
      status: err.response.status
    };
    dispatch({
      type: GET_ERRORS,
      payload: errors
    });
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