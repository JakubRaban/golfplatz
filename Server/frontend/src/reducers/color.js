/* eslint-disable complexity */
import { SET_ACTIVE_COURSE } from '../actions/types.js';

const initialState = {
  palette: ['5678ac', '405980', 'cfd8e6', '3068bf'],
  themeColors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_COURSE:
      return {
        themeColors : action.payload.themeColors,
        palette: action.payload.palette,
      };
    default:
      return state;
  }
}
