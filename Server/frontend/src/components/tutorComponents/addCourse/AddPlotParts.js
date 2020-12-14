import Typography from "@material-ui/core/Typography";
import PlotPart from "./PlotPart";
import Button from "@material-ui/core/Button";
import React from "react";

class AddPlotParts extends React.Component {
  render() {
    return (
      <div style={{margin: '10px'}}>
        <Typography variant="h6" gutterBottom>
          Dodaj części fabuły do kursu:
        </Typography>
        {this.props.plotParts.map((plotPart, index) =>
          <PlotPart
            errors={this.props.errors}
            handleChange={this.props.handlePlotPartChange}
            index={index}
            key={index}
            plotPart={plotPart}
          />,
        )}
        <Button
          color="secondary"
          variant='outlined'
          onClick={this.props.addNewPlotPart}
        >Dodaj kolejną część fabuły
        </Button>
      </div>
    )
  }
}

export default AddPlotParts;
