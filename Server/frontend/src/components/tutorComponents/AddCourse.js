import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addCourse } from '../../actions/course';
import AddCourseInitialInfo from "./AddCourseInitialInfo";
import AddGroupsAndPlot from "./AddGroupsAndPlot";
import AddCourseConfirm from "./AddCourseConfirm";
import { Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {styles} from "../../styles/style.js";
import compose from 'recompose/compose';
import { logout } from '../../actions/auth';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


export class AddCourse extends Component {
  state = {
    step: 1,
    name: '',
    description: '',
    courseGroups: [],
    plotParts: [],
    redirect: false,
  };

  static propTypes = {
    user: PropTypes.any,
    isAuthenticated: PropTypes.bool,
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleObjectChange = (input, value) => {
    this.setState({ [input]: value });
  }

  onSubmit = (e) => {
    // e.preventDefault();
    const { name, description, courseGroups, plotParts } = this.state;
    const course = { name, description };
    this.props.addCourse(course, courseGroups, plotParts);
    this.setState({
      name: '',
      description: '',
      courseGroups: [],
      plotParts: [],
      redirect: true,
    });
  };

  renderAddingStep(step, values) {
    switch (step) {
      case 1:
        return (
          <AddCourseInitialInfo
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <AddGroupsAndPlot
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleObjectChange}
            values={values}
          />
        );
      case 3:
        return (
          <AddCourseConfirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            submit={this.onSubmit}
            values={values}
          />
        );
    }
  }

  render() {
    const { step } = this.state;
    const { name, description, courseGroups, plotParts, chapters } = this.state;
    const values = { name, description, courseGroups, plotParts, chapters };
    const { classes } = this.props;

    if (this.state.redirect) {
      return (
        <Redirect to="/courses"/>
      )
    }
    if (!this.props.isAuthenticated) {
      return (
        <Redirect to="/login"/>
      )
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      )
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, false && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton component={Link} to="/"
              edge="start"
              color="inherit"
              aria-label="Powrót"
              className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Dodaj kurs
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={this.props.logout.bind(this)}>
              <Badge color="secondary">
                <PowerSettingsNewIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {this.renderAddingStep(step, values)}
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
  connect(mapStateToProps, { addCourse, logout }),
  withStyles(styles)
)(AddCourse);