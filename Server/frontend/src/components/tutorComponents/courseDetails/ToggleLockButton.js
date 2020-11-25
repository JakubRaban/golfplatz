
import React from "react";
import compose from "recompose/compose";
import {connect} from "react-redux";
import {unlockPlotPart} from "../../../actions/course.js";
import {Button} from "@material-ui/core";

class ToggleLockButton extends React.Component {
  render() {
    const isUnlocked = this.props.plotPart.isUnlocked;
    const id = this.props.plotPart.id;
    return (
      <Button
        variant={isUnlocked ? 'outlined' : 'contained'}
        color='primary'
        onClick={() => this.props.unlockPlotPart(id)}
      >{isUnlocked ? 'Zablokuj' : 'Odblokuj'} możliwość przechodzenia</Button>
    )
  }
}

export default compose(
  connect(null, { unlockPlotPart }),
)(ToggleLockButton);
