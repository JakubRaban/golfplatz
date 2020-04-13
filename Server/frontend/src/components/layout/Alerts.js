import React, {Component, Fragment} from 'react'
import {withAlert} from 'react-alert'
import {connect} from 'react-redux';
import PropTypes from 'prop-types'

export class Alerts extends Component {

  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(previousProps) {
    const {error, alert, message} = this.props;
    if(error !== previousProps.error) {
      if (error.msg.courseName) alert.error(`Course name: ${error.msg.courseName.join()}`);
      else if (error.msg.description) alert.error(`Description: ${error.msg.description.join()}`);
      else alert.error("Something went wrong")
    }
    if (message !== previousProps.message) {
      if (message.courseAdded) alert.success(message.courseAdded);
      else if (message.userRegistered) alert.success(message.userRegistered);
    }
  }

  render() {
    return (
      <Fragment />
    )
  }

}

const mapStateToProps = state => ({
  error: state.errors,
  message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));