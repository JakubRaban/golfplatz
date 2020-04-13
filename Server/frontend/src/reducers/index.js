import { combineReducers } from 'redux';
import course from './course'
import errors from "./errors"
import messages from "./messages";

export default combineReducers({
  course, errors, messages
});
