import React, { Component } from 'react';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../../styles/style.js';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

class NavBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" className={clsx(classes.appBar, false && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton component={Link} to={this.props.returnLink}
            edge="start"
            color="inherit"
            aria-label="Powrót"
            className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {this.props.title}
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
    );
  }
}

export default withStyles(styles)(NavBar);
