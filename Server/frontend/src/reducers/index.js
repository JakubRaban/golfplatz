import { combineReducers } from 'redux';

import auth from './auth.js';
import course from './course.js';
import errors from './errors.js';
import messages from './messages.js';


export default combineReducers({
  course, errors, messages, auth,
});
