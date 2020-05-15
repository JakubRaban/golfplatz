import React, {Component} from "react";
import { getCourses } from "../../actions/course";
import {connect} from "react-redux";
import PropTypes from "prop-types"
import { Link, Redirect } from 'react-router-dom';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
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
import MaterialTable from 'material-table';


export class GetCourses extends Component {
  constructor(props) {
    super(props);
    this.props.getCourses();
    this.props.courses.map(course =>
       (this.data.push({id: course.id, name: course.name, description: course.description, createdOn: course.createdOn})));
  }

  state = {
    chosenCourseId: -1,
  }
  
  static propTypes = {
    courses: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  data = [];
  columns = [
    { title: 'ID kursu', field: 'id', type: 'numeric' },
    { title: 'Nazwa', field: 'name' },
    { title: 'Opis', field: 'description' },
    { title: 'Utworzono', field: 'createdOn', type: 'date' },
  ];

  setRedirectedParams(d) {
    this.setState({
      chosenCourseId: d.id,
    })
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
    if (this.state.chosenCourseId !== -1) {
      let url = "/courses/" + this.state.chosenCourseId;
      return (
        <Redirect to={url}/>
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
              Lista kursów
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
          <MaterialTable
            title="Obejrzyj lub edytuj swoje kursy"
            columns={this.columns}
            data={this.data}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Zobacz/edytuj informacje o kursie',
                onClick: (event, d) => this.setRedirectedParams(d)
              },
            ]}
            options={{
              actionsColumnIndex: -1
            }}
            localization={{
              pagination: {
                  labelDisplayedRows: '{from}-{to} z {count}'
              },
              toolbar: {
                  nRowsSelected: 'Wybrano {0} pozycji',
                  searchPlaceholder: "Wyszukaj",
              },
              header: {
                  actions: 'Opcje'
              },
              body: {
                  emptyDataSourceMessage: 'Brak danych',
                  filterRow: {
                      filterTooltip: 'Filtruj'
                  }
              }
          }}
          />
          {/* <Table>

            <TableBody>
            { this.props.courses.map(course => (
              <TableRow component={Link} to={`/courses/${course.id}/`} key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.createdOn}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table> */}
        </main>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  courses: state.course.courses,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { getCourses, logout }),
  withStyles(styles)
)(GetCourses);