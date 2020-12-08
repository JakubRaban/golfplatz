/* eslint-disable react/no-direct-mutation-state */
import '../../../styles/course-forms.css';

import {
  Button, Collapse, CssBaseline, IconButton, Dialog, List, ListItem, ListItemText, LinearProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@material-ui/core/';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Modal from '@material-ui/core/Modal';
import React, {Component} from 'react';
import {isEmpty as empty} from 'lodash';
import isEmpty from 'validator/lib/isEmpty.js';
import {setWith} from 'lodash';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import compose from 'recompose/compose';
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';

import {logout} from '../../../actions/auth.js';
import {getPalette} from '../../../actions/color.js';
import {addChapters, getCourse} from '../../../actions/course.js';
import {styles} from '../../../styles/style.js';
import NavBar from '../../common/navbars/NavBar.js';
import AddChapter from './../AddChapter.js';
import ToggleLockButton from './ToggleLockButton';
import FormErrorMessage from "../../common/FormErrorMessage";
import PlotPart from "../addCourse/PlotPart";
import {addPlotPart} from "../../../actions/course";
import DialogContent from "@material-ui/core/DialogContent";
import AddPlotParts from "../addCourse/AddPlotParts";


class NewPlotPartModal extends Component {
  state = {
    plotParts: [{ name: '', introduction: '' }],
    errors: {}
  }

  handlePlotPartChange = (input, index, value) => {
    const { plotParts } = this.state;
    plotParts[index][input] = value;
    this.setState({ plotParts });
  }

  addNewPlotPart = () => {
    const { plotParts } = this.state;
    plotParts.push({ name: '', introduction: '' });
    this.setState({ plotParts });
  }

  // handleChange = (name, index, value) => {
  //   const { plotPart } = this.state;
  //   plotPart[name] = value;
  //   this.setState({ plotPart }, () => console.log(this.state));
  // }

  checkErrors = async () => {
    const errors = {};
    this.state.plotParts.forEach((plotPart, i) => {
      if (isEmpty(plotPart.name)) setWith(errors, `plotParts[${i}].name`, 'Nazwa części fabuły nie może być pusta');
      if (isEmpty(plotPart.introduction)) setWith(errors, `plotParts[${i}].introduction`, 'Opis części fabuły nie może być pusty');
    });
    await this.setState({ errors });
  }

  onConfirm = async () => {
    await this.checkErrors();
    if (empty(this.state.errors)) {
      this.props.onSubmit(this.state.plotParts);
      this.props.close();
    }
  }

  render() {
    return (
      <Dialog open={this.props.show} onClose={this.toggle}>
        <DialogContent>
          {/*<AddPlotParts plotPart={this.state.plotPart} errors={this.state.errors} index={0} handleChange={this.handleChange} />*/}
          <AddPlotParts plotParts={this.state.plotParts} errors={this.state.errors} handlePlotPartChange={this.handlePlotPartChange} addNewPlotPart={this.addNewPlotPart} />
          <Button variant="contained" color="primary" onClick={this.onConfirm}>Zatwierdź</Button>
        </DialogContent>
      </Dialog>
    )
  }
}


export class CourseDetails extends Component {
  state = {
    chapters: [{name: '', description: ''}],
    errors: {},
    loaded: false,
    open: [],
    openDialog: false,
    newPlotPartModalShown: false,
  };

  theme = createMuiTheme();

  componentDidMount() {
    this.props.getCourse(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.course !== this.props.course) {
      this.setPalette(this.props.course);
      this.setState({
        chapters: [{name: '', description: ''}],
        open: new Array(this.props.course.plotParts.length).fill(false),
        openDialog: false,
      });
    }
  }

  setPalette = async (course) => {
    await this.props.getPalette(course.themeColor);
    this.theme = await createMuiTheme({
      palette: {
        primary: {
          main: this.props.themeColors[0],
        },
        secondary: {
          main: this.props.themeColors[1],
        },
      },
    });
    await this.setState({loaded: true});
  }

  checkErrors = async () => {
    const errors = {}

    this.state.chapters.forEach((chapter, i) => {
      if (isEmpty(chapter.name)) setWith(errors, `chapters[${i}].name`, 'Nazwa rozdziału nie może być pusta');
      if (isEmpty(chapter.description)) setWith(errors, `chapters[${i}].description`, 'Opis rozdziału nie może być pusty');
    });

    await this.setState({errors});
  }

  onSubmit = async (plotPartId) => {
    await this.checkErrors();

    if (empty(this.state.errors)) {
      const {chapters} = this.state;
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
    this.setState({open});
  };

  handleClickOpen = () => {
    const assignHelper = this.state.openDialog;
    this.setState({
      openDialog: !assignHelper,
    });
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  addNewChapter = () => {
    const {chapters} = this.state;
    chapters.push({name: '', description: ''});
    this.setState({chapters});
  }

  handleChapterChange = (input, index, value) => {
    const {chapters} = this.state;
    chapters[index][input] = value;
    this.setState({chapters});
  }

  handleSubmitNewPlotParts = async (plotParts) => {
    await this.props.addPlotPart(this.props.course.id, plotParts);
  }

  render() {
    const {classes} = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to='/login'/>;
    }
    if (this.props.user.groups[0] === 1) {
      return (
        <Redirect to='/'/>
      );
    }
    return (
      <>
        {this.state.loaded ?
          <ThemeProvider theme={this.theme}>
            <NewPlotPartModal show={this.state.newPlotPartModalShown} close={() => this.setState({ newPlotPartModalShown: false })} onSubmit={(plotParts) => {this.handleSubmitNewPlotParts(plotParts)}} />
            <div className={classes.root}>
              <CssBaseline/>
              <NavBar logout={this.props.logout} title={'Szczegóły kursu'} returnLink={'/courses'}/>
              <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <div style={{margin: '5px'}}>
                  <Typography variant='h5' gutterBottom>
                    Oglądasz szczegóły kursu '{this.props.course.name}'
                  </Typography>
                  <Typography variant='h6' gutterBottom>
                    Zajęcia odbywają się o następujących porach:
                  </Typography>
                  <Table>
                    <TableBody>
                      {this.props.course.courseGroups.map((group, i) =>
                        <TableRow key={i}>
                          <TableCell>
                            {group.groupName}
                            <br/>
                            Kod zapisu dla studentów: <b>{group.accessCode}</b>
                          </TableCell>
                        </TableRow>,
                      )}
                    </TableBody>
                  </Table>
                  <Typography variant='h6' gutterBottom>
                    Części fabuły:
                  </Typography>
                  {this.props.course.plotParts.map((plotPart, i) =>
                    <React.Fragment key={i}>
                      <Typography variant='subtitle1' gutterBottom>
                        Część {i + 1}:
                      </Typography>
                      <ToggleLockButton plotPart={plotPart}/>
                      <List>
                        <ListItem>
                          <ListItemText primary='Nazwa' secondary={plotPart.name}/>
                        </ListItem>
                        <ListItem>
                          <ListItemText primary='Opis' secondary={plotPart.introduction}/>
                        </ListItem>
                        <ListItem button onClick={this.handleClick(i)}>
                          <ListItemText primary='Rozdziały'/>
                          {this.state.open[i] ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={this.state.open[i]} timeout='auto' unmountOnExit>
                          <List component='div' disablePadding>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nazwa rozdziału</TableCell>
                                  <TableCell>Opis</TableCell>
                                  <TableCell/>
                                </TableRow>
                              </TableHead>
                              {this.props.course.plotParts[i].chapters.map((chapter, j) =>
                                <TableBody key={j}>
                                  <TableRow>
                                    <TableCell>{chapter.name}</TableCell>
                                    <TableCell>{chapter.description}</TableCell>
                                    <TableCell>
                                      <IconButton component={Link} to={`/chapters/${chapter.id}/`}
                                                  color='inherit'
                                                  aria-label='Zobacz rozdział'>
                                        <EditIcon/>
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>,
                              )}
                            </Table>
                            <ListItem>
                              <Button variant='outlined' color='primary' onClick={this.handleClickOpen}>
                                Dodaj rozdział
                              </Button>
                              <Dialog fullWidth maxWidth='sm' open={this.state.openDialog} onClose={this.handleClose}>
                                <div style={{margin: '10px'}}>
                                  {this.state.chapters.map((chapter, index) =>
                                    <AddChapter
                                      errors={this.state.errors}
                                      chapter={chapter}
                                      handleChange={this.handleChapterChange}
                                      index={index}
                                      key={index}/>,
                                  )}
                                  <Button
                                    color='secondary'
                                    variant='outlined'
                                    onClick={this.addNewChapter}
                                  >Dodaj kolejny rozdział</Button>
                                  <div style={{float: 'right'}}>
                                    <Button
                                      color='primary'
                                      variant='contained'
                                      onClick={() => this.onSubmit(plotPart.id)}
                                    >Dalej
                                    </Button>
                                  </div>
                                </div>
                                {!empty(this.state.errors) && <FormErrorMessage style={{textAlign: 'right'}}/>}
                              </Dialog>
                            </ListItem>
                          </List>
                        </Collapse>
                      </List>
                    </React.Fragment>,
                  )}
                  <Button color="primary" variant="contained" onClick={() => this.setState({ newPlotPartModalShown: true })}>
                    Dodaj nową część fabuły
                  </Button>
                </div>
              </main>
            </div>
          </ThemeProvider> : <LinearProgress/>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  course: state.course.courseDetailed,
  palette: state.color.palette,
  themeColors: state.color.themeColors,
});

export default compose(
  connect(mapStateToProps, {getCourse, addPlotPart, addChapters, logout, getPalette}),
  withStyles(styles),
)(CourseDetails);
