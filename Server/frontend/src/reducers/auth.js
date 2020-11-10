import { LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, USER_LOADING } from '../actions/types.js';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null,
  loading: false,
  error: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        error: '',
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        error: '',
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
        error: action.payload,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
      };
    case USER_LOADED:
      return {
        ...state,
        error: '',
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case USER_LOADING:
      return {
        ...state,
        error: '',
        loading: true,
      };
    default:
      return state;
  }
}
