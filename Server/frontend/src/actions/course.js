import axios from 'axios';

import { ADD_COURSE } from './types.js';

export const addCourse = course => dispatch => {
  axios.post("API_ADDRESS", course).then(res => {
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
  }).catch(error => console.log(error));
};
