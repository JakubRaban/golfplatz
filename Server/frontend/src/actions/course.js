import axios from 'axios';

import { toServerForm } from '../clientServerTranscoders/adventureTranscoder.js';
import Alerts from '../components/common/alerts/Alerts.js';
import { tokenConfig } from './auth.js';
import { returnErrors } from './messages.js';
import { parseErrors } from './parseErrors.js';
import { ADD_ACHIEVEMENTS,
  ADD_ADVENTURES,
  ADD_ANSWER,
  ADD_CHAPTER,
  ADD_COURSE,
  ADD_COURSE_GROUPS,
  ADD_PLOT_PARTS,
  DELETE_ADVENTURE,
  ERRORS,
  GET_ACHIEVEMENTS,
  GET_ADVENTURES,
  GET_CHAPTER,
  GET_COURSE,
  GET_COURSES,
  NEXT_ADVENTURE,
  PATHS_WITH_DESCRIPTIONS,
  START_CHAPTER,
  UPDATE_ADVENTURE,
}
  from './types.js';

export const addAdventure = (adventure, chapterId) => (dispatch, getState) => {
  axios.post(`/api/chapters/${chapterId}/adventures/`, toServerForm(adventure), tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_ADVENTURES,
      payload: res.data,
    });
    Alerts.success('Pomyślnie dodano przygodę');
  })
    .catch((err) => {
      console.log(parseErrors(err.response.data));
      dispatch({
        type: ERRORS,
        payload: err.response.data,
      });
    });
};

export const updateAdventure = (adventure, id) => (dispatch, getState) => {
  axios.put(`/api/adventures/${id}/`, toServerForm(adventure), tokenConfig(getState)).then((res) => {
    dispatch({
      type: UPDATE_ADVENTURE,
      payload: res.data,
    });
    Alerts.success('Pomyślnie zaktualizowano przygodę');
  })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const deleteAdventure = (id) => (dispatch, getState) => {
  axios.delete(`/api/adventures/${id}/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: DELETE_ADVENTURE,
      id: id,
    });
    Alerts.success('Pomyślnie usunięto przygodę');
  })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const addPathsWithDescriptions = (pathsWithDescriptions, chapterId) => (dispatch, getState) => {
  axios.post(`/api/chapters/${chapterId}/submit/`, pathsWithDescriptions, tokenConfig(getState)).then((res) => {
    dispatch({
      type: PATHS_WITH_DESCRIPTIONS,
      payload: res.data,
    });
    Alerts.success('Pomyślnie dodano ścieżki i opisy');
  })
    .catch((err) => {
      console.log(err.response.data);
    });
};

export const updatePathsWithDescriptions = (pathsWithDescriptions, chapterId) => (dispatch, getState) => {
  axios.put(`/api/chapters/${chapterId}/submit/`, pathsWithDescriptions, tokenConfig(getState)).then((res) => {
    dispatch({
      type: PATHS_WITH_DESCRIPTIONS,
      payload: res.data,
    });
    Alerts.success('Pomyślnie zaktualizowano ścieżki i opisy');
  })
    .catch((err) => {
      Alerts.error(err.response.data);
    });
};

export const addChapters = (chapters, plotPartId) => (dispatch, getState) => {
  axios.post(`/api/plot_parts/${plotPartId}/chapters/`, chapters, tokenConfig(getState)).then((res) => {
    dispatch({
      type: ADD_CHAPTER,
      payload: res.data,
    });
    Alerts.success('Pomyślnie dodano rozdział');
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const addCourse = (course, courseGroups, plotParts, achievements) => (dispatch, getState) => {
  makeAllCourseRequests(course, plotParts, courseGroups, achievements, dispatch, getState);
};

async function makeAllCourseRequests(course, plotParts, courseGroups, achievements, dispatch, getState) {
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


  await axios.post(`/api/courses/${courseId}/plot_parts/`, plotParts, tokenConfig(getState)).then((res) => {
    Alerts.success('Pomyślnie dodano kurs');
    dispatch({
      type: ADD_PLOT_PARTS,
      payload: res.data,
    });
  })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });

    await axios.post(`/api/courses/${courseId}/achievements/`, achievements, tokenConfig(getState)).then((res) => {
      dispatch({
        type: ADD_ACHIEVEMENTS,
        payload: res.data,
      });
    })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
}

export const getAchievements = (courseId) => (dispatch, getState) => {
  axios.get(`/api/courses/${courseId}/accomplished_achievements`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_ACHIEVEMENTS,
      payload: res.data,
    });
  });
}

export const getAchievementsAfterChapter = (chapterId) => (dispatch, getState) => {
  axios.get(`/api/chapters/${chapterId}/new_achievements`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_ACHIEVEMENTS,
      payload: res.data,
    });
  });
}

export const getAdventures = (id) => (dispatch, getState) => {
  axios.get(`/api/chapters/${id}/adventures/`, tokenConfig(getState)).then((res) => {
    dispatch({
      type: GET_ADVENTURES,
      payload: res.data,
    });
  });
};

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
