import React from 'react';
import Typography from '@material-ui/core/Typography';

export class PlotPart extends React.Component {
  render() {
    return (
      <div key={this.props.index}>
        <Typography variant="subtitle2" gutterBottom>
          {this.props.index + 1} część fabuły.
        </Typography>
        <div className="row">
            <div className="col-25">
              <label className="label-class">Nazwa: </label>
            </div>
            <div className="col-75">
              <input className="input-class" value={this.props.group} type="text" name="plotPartName"
                onChange={() => this.props.handleChange('name', this.props.index, event.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class">Krótki opis: </label>
            </div>
            <div className="col-75">
              <input className="input-class" value={this.props.group} type="text" name="introduction"
                onChange={() => this.props.handleChange('introduction', this.props.index, event.target.value)}
              />
            </div>
          </div>
      </div>
    );
  }
}

export default PlotPart;
