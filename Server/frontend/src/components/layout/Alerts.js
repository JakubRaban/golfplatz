import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';

export class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  };

  componentDidUpdate(previousProps) {
    const { error, alert, message } = this.props;
    if (error !== previousProps.error) {
      if (error.msg.courseName) alert.error(`Course name: ${error.msg.courseName.join()}`);
      else if (error.msg.description) alert.error(`Description: ${error.msg.description.join()}`);
      else if (error.msg.email) alert.error('Wpisz poprawny adres e-mail');
      // hasła:
      else if (error.msg.nonFieldErrors) alert.error(`${error.msg.nonFieldErrors.join()}`);

      // kwestia whoami:
      else return;
    }
    if (message !== previousProps.message) {
      if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
      else if (message.courseAdded) alert.success(message.courseAdded);
      else if (message.userRegistered) alert.success(message.userRegistered);
      else if (message.logout) alert.success(message.logout);
    }
  }

  render() {
    return (
      <Fragment />
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));
