import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_FAIL, LOGOUT_SUCCESS, LOGIN_SUCCESS } from '../actions/types.js';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
};

export default function(state = initialState, action) {
  switch(action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
}