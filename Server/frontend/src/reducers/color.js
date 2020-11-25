/* eslint-disable complexity */
import { SET_PALETTE, SET_THEME_COLOR } from '../actions/types.js';

const initialState = {
  palette: ['5678ac', '405980', 'cfd8e6', '3068bf'],
  themeColors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PALETTE:
      return {
        ...state,
        palette: action.payload,
      };
    case SET_THEME_COLOR:
      return {
        ...state,
        themeColors: action.payload,
      };
    default:
      return state;
  }
}
