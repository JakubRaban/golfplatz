/* eslint-disable react/no-direct-mutation-state */
import '../../styles/course-forms.css';

import { List, ListItem, ListItemText } from '@material-ui/core/';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { isEmpty as empty } from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';
import { setWith } from 'lodash';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { addChapters, getCourse } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';
import AddChapter from './AddChapter.js';

export class CourseDetails extends Component {
  constructor(props) {
    super(props);
    props.getCourse(props.match.params.id);
  }

  state = {
    chapters: [{ name: '', description: '' }],
    errors: {},
    open: [],
    openDialog: false,
  };

  static propTypes = {
    course: PropTypes.any.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.course !== this.props.course) {
      this.setState({
        chapters: [{ name: '', description: '' }],
        open: new Array(this.props.course.plotParts.length).fill(false),
        openDialog: false,
      });
    }
  }

  checkErrors = async () => {
    const errors = {}

    this.state.chapters.forEach((chapter, i) => {
      if (isEmpty(chapter.name)) setWith(errors, `chapters[${i}].name`, 'Nazwa rozdziału nie może być pusta');
      if (isEmpty(chapter.description)) setWith(errors, `chapters[${i}].description`, 'Opis rozdziału nie może być pusty');
    });

    await this.setState({ errors });
  }

  onSubmit = async (plotPartId) => {
    await this.checkErrors();

    if (empty(this.state.errors)) {
      const { chapters } = this.state;
      this.updateChapters(chapters, plotPartId);
    }
   };

  async updateChapters(chapters, plotPartId) {
    await this.props.addChapters(chapters, plotPartId);
    await this.props.getCourse(this.props.match.params.id);
  }

  handleClick = (i) => (e) => {
    const open = [...this.state.open];
    const assignHelper = open[i];
    open[i] = !assignHelper;
    this.setState({ open });
  };

  handleClickOpen = () => {
    const assignHelper = this.state.openDialog;
    this.setState({
      openDialog: !assignHelper,
    });
  };

  addNewChapter = () => {
    const { chapters } = this.state;
    chapters.push({ name: '', description: '' });
    this.setState({ chapters });
  }

  handleChapterChange = (input, index, value) => {
    const { chapters } = this.state;
    chapters[index][input] = value;
    this.setState({ chapters });
  }

  render() {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Szczegóły kursu'} returnLink={'/courses'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {Object.keys(this.props.course).length !== 0 ?
            <div style={{ margin: '5px' }}>
              <Typography variant="h5" gutterBottom>
              Oglądasz szczegóły kursu "{this.props.course.name}"
              </Typography>
              <Typography variant="h6" gutterBottom>
              Zajęcia odbywają się o następujących porach:
              </Typography>
              <Table>
                <TableBody>
                  { this.props.course.courseGroups.map((group, i) =>
                    <TableRow key={i}>
                      <TableCell>{group.groupName}</TableCell>
                    </TableRow>,
                  )}
                </TableBody>
              </Table>
              <Typography variant="h6" gutterBottom>
              Części fabuły:
              </Typography>
              { this.props.course.plotParts.map((plotPart, i) =>
                <React.Fragment key={i}>
                  <Typography variant="subtitle1" gutterBottom>
                  Część {i + 1}:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Nazwa" secondary={plotPart.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Opis" secondary={plotPart.introduction} />
                    </ListItem>
                    <ListItem button onClick={this.handleClick(i)}>
                      <ListItemText primary="Rozdziały" />
                      {this.state.open[i] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.open[i]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Nazwa rozdziału</TableCell>
                              <TableCell>Opis</TableCell>
                              <TableCell />
                            </TableRow>
                          </TableHead>
                          { this.props.course.plotParts[i].chapters.map((chapter, j) =>
                            <TableBody key={j}>
                              <TableRow>
                                <TableCell>{chapter.name}</TableCell>
                                <TableCell>{chapter.description}</TableCell>
                                <TableCell>
                                  <IconButton component={Link} to={`/chapters/${chapter.id}/`}
                                    color="inherit"
                                    aria-label="Edytuj rozdział">
                                    <EditIcon/>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>,
                          )}
                        </Table>
                        <ListItem>
                          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                        Dodaj rozdział
                          </Button>
                          <Dialog open={this.state.openDialog} fullWidth={true} maxWidth='sm'>
                            <div style={{ margin: '10px' }}>
                              { this.state.chapters.map((chapter, index) =>
                                <AddChapter
                                  errors={this.state.errors}
                                  chapter={chapter}
                                  handleChange={this.handleChapterChange}
                                  index={index}
                                  key={index} />,
                              )}
                              <Button
                                color="secondary"
                                variant='outlined'
                                onClick={this.addNewChapter}
                              >Dodaj kolejny rozdział</Button>
                              <div style={{ float: 'right' }}>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={() => this.onSubmit(plotPart.id)}
                                >Dalej</Button>
                              </div>
                            </div>
                          </Dialog>
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                </React.Fragment>,
              ) }
            </div> :
            <div>loading</div>
          }
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  course: state.course.courseDetailed,
});

export default compose(
  connect(mapStateToProps, { getCourse, addChapters, logout }),
  withStyles(styles),
)(CourseDetails);
