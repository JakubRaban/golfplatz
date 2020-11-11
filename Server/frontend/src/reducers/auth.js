import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, USER_LOADING } from '../actions/types.js';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
