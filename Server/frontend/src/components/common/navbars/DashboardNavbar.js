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

import { styles } from '../../../styles/style.js';
import SystemKeyModal from '../SystemKeyModal.js';

class DashboardNavbar extends Component {
  state = { selectedCourse: '', showSystemKeyModal: false };

  handleSelect = (e) => {
    this.setState({ selectedCourse: e.target.value});
    this.props.handleChange(e.target.value);
  }

  closeSystemKeyModal = () => {
    this.setState({ showSystemKeyModal: false });
  }

  openSystemKeyModal = () => {
    this.setState({ showSystemKeyModal: true });
  }

  render() {
    const { classes, courses } = this.props;
    return (
      <AppBar position='absolute' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
            {this.props.title}
          </Typography>
          <div className={classes.dropdown}>
            <Select
              displayEmpty
              value={this.state.selectedCourse}
              onChange={this.handleSelect}
              input={<Input />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Wybierz aktywny kurs</em>;
                }
                return selected;
              }}
            >
              <MenuItem disabled value=''>
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

export default withStyles(styles)(DashboardNavbar);
