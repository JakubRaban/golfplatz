import { combineReducers } from 'redux';

import auth from './auth.js';
import color from './color.js';
import course from './course.js';

export default combineReducers({
  auth, color, course,
});
