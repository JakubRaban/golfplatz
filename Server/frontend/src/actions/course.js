import axios from 'axios';

import { ADD_ADVENTURES,
  ADD_ANSWER,
  ADD_CHAPTER,
  ADD_COURSE,
  ADD_COURSE_GROUPS,
  ADD_PLOT_PARTS,
  GET_CHAPTER,
  GET_COURSE,
  GET_COURSES,
  NEXT_ADVENTURE,
  START_CHAPTER,
}
  from '../actions/types.js';
import { tokenConfig } from './auth.js';
import { createMessage, returnErrors } from './messages.js';


export const addAdventures = (adventures, chapterId) => (dispatch, getState) => {
  axios.post(`/api/chapters/${chapterId}/adventures/`, adventures, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_ADVENTURES,
      payload: res.data,
    });
  })
    .catch((err) => {
      console.log(err.response.data);
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const addChapters = (chapters, plotPartId) => (dispatch, getState) => {
  axios.post(`/api/plot_parts/${plotPartId}/chapters/`, chapters, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_CHAPTER,
      payload: res.data,
    });
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const addCourse = (course, courseGroups, plotParts, chapters) => (dispatch, getState) => {
  makeAllCourseRequests(course, plotParts, courseGroups, chapters, dispatch, getState);
};

async function makeAllCourseRequests(course, plotParts, courseGroups, chapters, dispatch, getState) {
  let courseId = -1;
  await axios.post('/api/courses/', course, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_COURSE,
      payload: res.data,
    });
    courseId = res.data.id;
  })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status));
    });

  const courseGroupsNames = courseGroups.map((x) => x.groupName);

  await axios.post(`/api/courses/${courseId}/course_groups/`, courseGroupsNames, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_COURSE_GROUPS,
      payload: res.data,
    });
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });

  // let plotPartsData = [];

  await axios.post(`/api/courses/${courseId}/plot_parts/`, plotParts, tokenConfig(getState)).then((res) => {
    dispatch(createMessage({ courseAdded: 'Kurs dodany pomyślnie' }));
    dispatch({
      type: ADD_PLOT_PARTS,
      payload: res.data,
    });
    // plotPartsData = res.data;
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
}

export const getCourses = () => (dispatch, getState) => {
  axios.get('/api/courses/', tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_COURSES,
      payload: res.data,
    });
  });
};


export const getCourse = (id) => (dispatch, getState) => {
  axios.get(`/api/courses/${id}/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_COURSE,
      payload: res.data,
    });
  });
};

export const getChapter = (id) => (dispatch, getState) => {
  axios.get(`/api/chapters/${id}/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_CHAPTER,
      payload: res.data,
    });
  });
};

export const startChapter = (id) => (dispatch, getState) => {
  axios.get(`/api/play/start/${id}/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: START_CHAPTER,
      payload: res.data,
    });
  });
};

export const addAdventureAnswer = (id, answer) => (dispatch, getState) => {
  axios.post(`/api/play/answer/${id}/`, answer, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_ANSWER,
      payload: res.data,
    });
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const chooseNextAdventure = (id) => (dispatch, getState) => {
  axios.get(`/api/play/path_choice/${id}/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: NEXT_ADVENTURE,
      payload: res.data,
    });
  });
};
