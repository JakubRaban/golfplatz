/* eslint-disable complexity */
import {SET_ACTIVE_COURSE, SET_PALETTE, SET_THEME_COLOR} from '../actions/types.js';
import {MAIN_COLOR} from "../actions/color";
const ColorScheme = require('color-scheme');

const initialState = {
  palette: ['5678ac', '405980', 'cfd8e6', '3068bf'],
  themeColors: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_COURSE:
      const color = action.payload?.themeColor || MAIN_COLOR;
      const colorNumber = color.substring(1);
      const contrastScheme = new ColorScheme;
      contrastScheme.from_hex(colorNumber).scheme('contrast').variation('default');
      const themeColors = [color, `#${contrastScheme.colors()[5]}`];
      const scheme = new ColorScheme;
      scheme.from_hex(colorNumber).scheme('monochromatic').variation('pastel');
      return {
        ...state,
        themeColors,
        palette: scheme.colors()
      }
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
