
import React from "react";
import Typography from "@material-ui/core/Typography";

class FormErrorMessage extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <Typography style={{...style, color: 'red'}}>
        Formularz zawiera błędy. Popraw je i spróbuj ponownie.
      </Typography>
    )
  }
}

export default FormErrorMessage;
