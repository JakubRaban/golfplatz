import {REGISTER_SUCCESS, REGISTER_FAIL} from './types';
import {createMessage, returnErrors} from './messages';
import axios from 'axios';


export const registerTutor = ({firstName, lastName, email, password}) => (dispatch) => {
  const body = JSON.stringify({firstName, lastName, email, password});

  postRegisterRequest('tutor', body, dispatch);
};

export const registerStudent = ({firstName, lastName, email, password, studentNumber, phoneNumber}) => (dispatch) => {
  const body = JSON.stringify({firstName, lastName, email, password, studentNumber, phoneNumber});

  postRegisterRequest('student', body, dispatch);
};

function postRegisterRequest(user, body, dispatch) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const apiAddress = '/api/register/' + user + '/';
  axios
    .post(apiAddress, body, config)
    .then((res) => {
      dispatch(createMessage({userRegistered: `New ${user} successfully registered`}));
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