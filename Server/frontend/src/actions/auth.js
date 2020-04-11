import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';
import { returnErrors } from './messages';
import axios from 'axios';



export const registerTutor = ({ name, surname, email, password }) => (dispatch) => {
    const body = JSON.stringify({ name, surname, email, password });

    postRegisterRequest('tutor/', body, dispatch);
};

export const registerStudent = ({ name, surname, email, password, indexNumber, phoneNumber }) => (dispatch) => {
    const body = JSON.stringify({ name, surname, email, password, indexNumber, phoneNumber });

    postRegisterRequest('student/', body, dispatch);
};

function postRegisterRequest(user, body, dispatch) {
    const config = {
        headers: {
        'Content-Type': 'application/json',
        },
    };
    const apiAddress = '/api/register/' + user;
    axios
        .post(apiAddress, body, config)
        .then((res) => {
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