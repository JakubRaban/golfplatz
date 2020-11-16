import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavBar from '../common/navbars/NavBar.js';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';

export class CourseStructure extends Component {
  state = { loading: false };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 2) {
      return (
        <Redirect to="/"/>
      );
    }
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title='NAZWA KURSU O' returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div style={{ margin: '5px' }}>
            {this.state.loading ? <div>Ładowanie</div> :
              <>
                <span> Kenobi </span>
              </>
            }
          </div>
        </main>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { logout }),
  withStyles(styles),
)(CourseStructure);
