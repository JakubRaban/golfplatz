import axios from 'axios';

import { ADD_COURSE } from './types.js';

export const addCourse = course => dispatch => {
  axios.post("/api/course/add/", course).then(res => {
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
  }).catch(error => console.log(error));
};
