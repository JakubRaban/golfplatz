import { combineReducers } from 'redux';
import course from './course'
import errors from "./errors"

export default combineReducers({
  course, errors
});
