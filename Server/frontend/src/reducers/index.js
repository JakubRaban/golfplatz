import { combineReducers } from 'redux';

import auth from './auth.js';
import course from './course.js';


export default combineReducers({
  course, auth,
});
