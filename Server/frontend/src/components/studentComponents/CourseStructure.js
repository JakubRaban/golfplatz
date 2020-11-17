import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavBar from '../common/navbars/NavBar.js';
import compose from 'recompose/compose';
import { CssBaseline, List, ListSubheader, Typography } from '@material-ui/core';

import { getCourseStructure } from '../../actions/course.js';
import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';

export class CourseStructure extends Component {
  state = { loaded: false };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidMount() {
    this.props.getCourseStructure(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseStructure !== this.props.courseStructure) {
      this.setState({ loaded: true });
    }
  }

  getCourseName() {
    const name = this.props.courseStructure?.name || '';
    return `Wirok kursu ${name}`;
  }

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
    console.log(this.props);
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div style={{ margin: '5px' }}>
            {this.state.loaded &&
              <>
                <Typography component='h6' variant='h6'>
                  {this.props.courseStructure.description}
                </Typography>
                {this.props.courseStructure.plotParts.map((plotPart, index) => {
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                      <ListSubheader component="div" id="nested-list-subheader">
                        {index + 1} część fabuły kursu.
                      </ListSubheader>
                    }
                  >
                    {/* <ListItem button onClick={handleClick}>

                      <ListItemText primary="Inbox" />
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem button className={classes.nested}>
                          <ListItemIcon>
                            <StarBorder />
                          </ListItemIcon>
                          <ListItemText primary="Starred" />
                        </ListItem>
                      </List>
                    </Collapse> */}
                  </List>
                })}
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
  courseStructure: state.course.courseStructure,
});

export default compose(
  connect(mapStateToProps, { logout, getCourseStructure }),
  withStyles(styles),
)(CourseStructure);
