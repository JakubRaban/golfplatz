import React, {Component} from "react";
import { getCourses } from "../../actions/course";
import {connect} from "react-redux";
import PropTypes from "prop-types"
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
import MaterialTable from 'material-table';


export class GetCourses extends Component {
  constructor(props) {
    super(props);
    props.getCourses();
  }

  state = {
    chosenCourseId: -1,
    data: [],
  }
  
  static propTypes = {
    courses: PropTypes.array,
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

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

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      let dataTmp = [];
      this.props.courses.map(course =>
        (dataTmp.push({id: course.id, name: course.name, description: course.description, createdOn: course.createdOn}))
      );
      this.setState({
        data: dataTmp,
      })   
    }
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
            data={this.state.data}
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
                  labelDisplayedRows: '{from}-{to} z {count}',
                  labelRowsSelect: "wyników",
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