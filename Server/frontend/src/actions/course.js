import axios from 'axios';
import { tokenConfig } from './auth.js'; 
import { ADD_COURSE, ADD_COURSE_GROUPS, ADD_PLOT_PARTS, GET_COURSES } from './types.js';
import {createMessage, returnErrors} from "./messages";


export const addCourse = (course, courseGroups, plotParts) => (dispatch, getState) => {
  let courseId;
  let body = {plotParts};
  makeAllCourseRequests(course, plotParts, courseGroups, dispatch, getState);
};

async function makeAllCourseRequests(course, plotParts, courseGroups, dispatch, getState) {
  let courseId = -1;
  await axios.post("/api/courses/", course, tokenConfig(getState)).then(res=>{
    dispatch({
      type: ADD_COURSE,
      payload: res.data
    });
    courseId = res.data.id;
  }).catch(err => {
    console.log(err);
    dispatch(returnErrors(err.response.data, err.response.status));
  });

  let courseGroupsNames = courseGroups.map(x => x.groupName);

  await axios.post("/api/courses/" + courseId + "/course_groups/", courseGroupsNames, tokenConfig(getState)).then(res => {
    dispatch({
      type: ADD_COURSE_GROUPS,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });

  await axios.post("/api/courses/" + courseId + "/plot_parts/", plotParts, tokenConfig(getState)).then(res=>{
    dispatch(createMessage({courseAdded: "Kurs dodany pomyślnie"}));
    dispatch({
      type: ADD_PLOT_PARTS,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status));
  });

}



export const getCourses = () => (dispatch, getState) => {
  axios.get("/api/courses/", tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_COURSES,
      payload: res.data
    })
  })
};