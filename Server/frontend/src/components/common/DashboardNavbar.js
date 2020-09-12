import React, { Component } from 'react';
import Badge from '@material-ui/core/Badge';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import {styles} from "../../styles/style.js";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

class DashboardNavbar extends Component {
  render() {
    const { classes } = this.props;
    const open = this.props.open;
    return (
      <>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
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
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.props.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <Divider />
          <Divider />
        </Drawer>
      </>
    );
  }
}

export default withStyles(styles)(DashboardNavbar);
