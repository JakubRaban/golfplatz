import { SET_PALETTE, SET_THEME_COLOR, SET_ACTIVE_COURSE } from './types.js';

const ColorScheme = require('color-scheme');

export const MAIN_COLOR = '#3f51b5';

export const getPalette = (course) => (dispatch) => {
  console.log("setPalette", course);
  const color = course?.themeColor || MAIN_COLOR;
  setTheme(color, dispatch);
  
  const colorNumber = color.substring(1);

  const scheme = new ColorScheme;
  scheme.from_hex(colorNumber).scheme('monochromatic').variation('pastel');

  dispatch({
    type: SET_PALETTE,
    payload: scheme.colors(),
  });
  dispatch({
    type: SET_ACTIVE_COURSE,
    payload: course,
  })
};

function setTheme(color, dispatch) {
  const colorNumber = color.substring(1);

  const scheme = new ColorScheme;
  scheme.from_hex(colorNumber).scheme('contrast').variation('default');

  const themeColors = [color, `#${scheme.colors()[5]}`];

  dispatch({
    type: SET_THEME_COLOR,
    payload: themeColors,
  });
}
