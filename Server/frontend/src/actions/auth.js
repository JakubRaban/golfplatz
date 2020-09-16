import axios from 'axios';

import { createMessage, returnErrors } from './messages.js';
import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  USER_LOADING,
} from './types.js';


export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/whoami/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};


export const logout = () => (dispatch, getState) => {
  axios
    .post('/api/logout/', null, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ logout: 'Wylogowano pomyślnie' }));
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

export const login = (email, password) => (dispatch) => {
  const config = getBasicHeader();
  const body = JSON.stringify({ email, password });

  axios
    .post('/api/login/', body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const registerTutor = ({ firstName, lastName, email, password }) => (dispatch) => {
  const body = JSON.stringify({ firstName, lastName, email, password });

  postRegisterRequest('tutor', body, dispatch);
};

export const registerStudent = ({ firstName, lastName, email, password, studentNumber, phoneNumber }) => (dispatch) => {
  const body = JSON.stringify({ firstName, lastName, email, password, studentNumber, phoneNumber });

  postRegisterRequest('student', body, dispatch);
};

function postRegisterRequest(user, body, dispatch) {
  const config = getBasicHeader();
  const apiAddress = `/api/register/${user}/`;
  axios
    .post(apiAddress, body, config)
    .then((res) => {
      dispatch(createMessage({ userRegistered: `${user} pomyślnie zarejestrowany` }));
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: REGISTER_FAIL,
      });
    });
}

function getBasicHeader() {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export const tokenConfig = (getState) => {
  const { token } = getState().auth;

  const config = getBasicHeader();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
};
