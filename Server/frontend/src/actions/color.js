import { SET_PALETTE, SET_THEME_COLOR} from './types.js';
import { createMuiTheme } from '@material-ui/core/styles';

const ColorScheme = require('color-scheme');

export const getPalette = (color) => (dispatch) => {
  setTheme(color, dispatch);
  
  const colorNumber = color.substring(1);

  const scheme = new ColorScheme;
  scheme.from_hex(colorNumber).scheme('monochromatic').variation('pastel');

  dispatch({
    type: SET_PALETTE,
    payload: scheme.colors(),
  });
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
