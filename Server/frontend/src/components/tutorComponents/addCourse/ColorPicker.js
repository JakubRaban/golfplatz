
import React from 'react';
import { ChromePicker } from "react-color";
import {Typography} from "@material-ui/core";

class ColorPicker extends React.Component {

  render() {
    const { color, changeColor } = this.props;

    return (
      <div style={{ margin: '10px' }}>
        <Typography variant="h6" gutterBottom>
          Wybierz kolor motywu kursu:
        </Typography>
        <ChromePicker color={color} onChangeComplete={changeColor} />
      </div>
    );
  }

}

export default ColorPicker;