import axios from 'axios';
import { tokenConfig } from './auth.js'; 
import { ADD_COURSE, GET_COURSES } from './types.js';
import {createMessage, returnErrors} from "./messages";


export const addCourse = course => (dispatch, getState) => {
  axios.post("/api/courses/", course, tokenConfig(getState)).then(res => {
    dispatch(createMessage({courseAdded: "Kurs dodany pomyślnie"}));
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });
};

export const getCourses = () => (dispatch, getState) => {
  axios.get("/api/courses/", tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_COURSES,
      payload: res.data
    })
  })
};