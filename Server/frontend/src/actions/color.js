const ColorScheme = require('color-scheme');

import { SET_ACTIVE_COURSE } from './types.js';

export const MAIN_COLOR = '#3f51b5';

export const getPalette = (course) => (dispatch) => {
  const color = course?.themeColor || MAIN_COLOR;
  const colorNumber = color.substring(1);

  const contrastScheme = new ColorScheme;
  contrastScheme.from_hex(colorNumber).scheme('contrast').variation('default');

  const themeColors = [color, `#${contrastScheme.colors()[5]}`];
  const scheme = new ColorScheme;
  scheme.from_hex(colorNumber).scheme('monochromatic').variation('pastel');

  const palette = scheme.colors();
  const colorReduxProps = { course, themeColors, palette };
  
  dispatch({
    type: SET_ACTIVE_COURSE,
    payload: colorReduxProps,
  })
};
