import React from 'react';
import Typography from '@material-ui/core/Typography';

export class CourseGroup extends React.Component {
  render() {
    return (
      <div key={this.props.index}>
        <div className="row">
          <div className="col-25">
            <label className="label-class">Dzień i godzina zajęć: </label>
          </div>
          <div className="col-75">
            <input className="input-class" value={this.props.group} type="text" name="groupName"
              onChange={() => this.props.handleChange(this.props.index, event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CourseGroup;
