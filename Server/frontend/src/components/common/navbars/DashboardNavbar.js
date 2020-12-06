import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/Lock';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { styles } from '../../../styles/style.js';
import SystemKeyModal from '../SystemKeyModal.js';
import {getPalette} from "../../../actions/color";

class DashboardNavbar extends Component {
  state = { showSystemKeyModal: false };

  closeSystemKeyModal = () => {
    this.setState({ showSystemKeyModal: false });
  }

  openSystemKeyModal = () => {
    this.setState({ showSystemKeyModal: true });
  }

  render() {
    const { classes, courses, handleChange } = this.props;
    console.log("ac", this.props.activeCourse);
    return (
      <AppBar position='absolute' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
            {this.props.title}
          </Typography>
          <div className={classes.dropdown}>
            <Select
              displayEmpty
              value={this.props.activeCourse?.name || ''}
              onChange={handleChange}
              input={<Input />}
            >
              <MenuItem disabled value={''}>
                <em>Wybierz aktywny kurs:</em>
              </MenuItem>
              {courses.map((course, index) => (
                <MenuItem key={index} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          {this.props.isTutor &&
            <IconButton color='inherit' onClick={this.openSystemKeyModal}>
              <Badge color='secondary'>
                <LockIcon />
              </Badge>
            </IconButton>
          }
          <IconButton color='inherit' onClick={this.props.logout.bind(this)}>
            <Badge color='secondary'>
              <PowerSettingsNewIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        <SystemKeyModal
          onClose={this.closeSystemKeyModal}
          open={this.state.showSystemKeyModal}
          systemKey={this.props.systemKey?.systemKey}
        />
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => ({
  activeCourse: state.course.active,
});

export default compose(
  connect(mapStateToProps, { getPalette }),
  withStyles(styles),
)(DashboardNavbar);
