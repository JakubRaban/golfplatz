import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCourse, addChapters } from "../../actions/course";
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import { Form, Text, NestedForm } from "react-form";
import {styles} from "./styles/style.js";
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
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { List, ListItem, ListItemText } from '@material-ui/core/';
import "./styles/course-forms.css";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import EditIcon from '@material-ui/icons/Edit';


const Chapters = ({ i }) => (
  <NestedForm field={["chapters", i]} key={`nested-chapters-${i}`}>
    <Form>
      {formApi => (
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Rozdział
          </Typography>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-chapters-first-${i}`}>Nazwa:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="name" id={`nested-chapters-first-${i}`} />
            </div>
          </div>
          <div className="row">
            <div className="col-25">
              <label className="label-class" htmlFor={`nested-chapters-last-${i}`}>Krótki opis:</label>
            </div>
            <div className="col-75">
              <Text className="input-class" field="description" id={`nested-chapters-last-${i}`} />
            </div>
          </div>
        </div>
      )}
    </Form>
  </NestedForm>
);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#42a5f5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
    }
  },
});

export class CourseDetails extends Component {  
  constructor(props) {
    props.getCourse(props.match.params.id);
    super(props);
  }
  
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
    course: PropTypes.any.isRequired,
  };

  state = {
    chapters: [],
    open: new Array(this.props.course.plotParts.length).fill(false),
    openDialog: false,
  };

  firstChapter = {};
  currentPlotPartId = -1;

  onSubmit = (e) => {
    // e.preventDefault();
    this.state.chapters.pop();
    this.state.chapters.unshift(this.firstChapter);

    const { chapters } = this.state;
    this.props.addChapters(chapters, this.currentPlotPartId);
    this.setState({
      chapters: [],
      openDialog: false,
    });  
  };

  handleClick = i => (e) => {
    let open = [...this.state.open];
    let assignHelper = open[i];
    open[i] = !assignHelper;
    this.setState({open});
  };

  handleClickOpen = () => {
    let assignHelper = this.state.openDialog;
    this.setState({
      openDialog: !assignHelper
    });
  };

  mapAllChapters(chapterValues, id) {
    this.currentPlotPartId = id;
    if (chapterValues.length === 1) {
      this.firstChapter = chapterValues[0];
    } else {
      this.state.chapters = chapterValues;
    }
  }

  componentDidUpdate(prevProps) {
    //wywolac po dodaniu rozdzialu, aby pojawil sie w liscie rozdzialow
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    const { classes } = this.props;

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
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
          <IconButton component={Link} to="/courses"
            edge="start"
            color="inherit"
            aria-label="Powrót"
            className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Szczegóły kursu
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
        <div style={{margin: '5px'}}>
          <Typography variant="h5" gutterBottom>
            Oglądasz szczegóły kursu "{this.props.course.name}"
          </Typography>
          <Typography variant="h6" gutterBottom>
            Zajęcia odbywają się o następujących porach:
          </Typography>
          <Table>
            <TableBody>
              { this.props.course.courseGroups.map((group, i) => (
                <TableRow key={i}>
                  <TableCell>{group}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="h6" gutterBottom>
            Części fabuły:
          </Typography>            
          { this.props.course.plotParts.map((plotPart, i) => (
            <React.Fragment>
              <Typography variant="subtitle1" gutterBottom>
                Część {i+1}:
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
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                      { this.props.course.plotParts[i].chapters.map((chapter, i) => 
                        <TableBody>
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
                        </TableBody>
                      )}
                      </Table> 
                    <ListItem>
                    <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                      Dodaj rozdział
                    </Button>
                    <MuiThemeProvider theme={theme}>
                    <React.Fragment>
                      <CssBaseline />
                      <Dialog open={this.state.openDialog} fullWidth="true" maxWidth='sm'>
                        <div style={{margin: '10px'}}>
                        <Form onSubmit={this.onSubmit}>
                          {formApi => (
                          <form onSubmit={formApi.submitForm} id="course-group-form">
                            <div key={0}>
                              <Chapters i={0} />
                            </div>
                            {formApi.values.chapters &&
                              formApi.values.chapters.slice(1).map((f, i) => (
                                <div key={i}>
                                  <Chapters i={i} />
                                </div>
                              ), this.mapAllChapters(formApi.values.chapters, plotPart.id))}
                            <Button
                                color="secondary"
                                variant='outlined'
                                onClick={() =>
                                  formApi.addValue("chapters", {
                                    name: "",
                                    description: "",
                                  })
                                }
                              >Dodaj kolejny rozdział</Button>        
                            <div style={{float: 'right'}}>
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={this.onSubmit}
                              >Dalej</Button>
                            </div>
                          </form>
                          )}
                        </Form>
                        </div>
                      </Dialog>
                      </React.Fragment>
                    </MuiThemeProvider>
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </React.Fragment>
          )) } 
        </div>
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
  connect(mapStateToProps, {getCourse, addChapters, logout}),
  withStyles(styles)
)(CourseDetails);