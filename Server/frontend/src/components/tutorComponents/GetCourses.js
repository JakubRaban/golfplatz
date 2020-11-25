import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';

import { logout } from '../../actions/auth.js';
import { getCourses } from '../../actions/course.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';

export class GetCourses extends Component {
  columns = [
    { title: 'ID kursu', field: 'id', type: 'numeric' },
    { title: 'Nazwa', field: 'name' },
    { title: 'Opis', field: 'description' },
    { title: 'Utworzono', field: 'createdOn', type: 'date' },
  ];

  constructor(props) {
    super(props);
    props.getCourses();
  }

  state = {
    chosenCourseId: -1,
    data: [],
  }

  static propTypes = {
    logout: PropTypes.func.isRequired,
    courses: PropTypes.array,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps.courses !== this.props.courses) {
      const dataTmp = [];
      this.props.courses.map((course) =>
        dataTmp.push({ id: course.id, name: course.name, description: course.description, createdOn: course.createdOn }),
      );
      this.setState({
        data: dataTmp,
      });
    }
  }

  setRedirectedParams(d) {
    this.setState({
      chosenCourseId: d.id,
    });
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
    if (this.state.chosenCourseId !== -1) {
      const url = `/courses/${this.state.chosenCourseId}`;
      return (
        <Redirect to={url}/>
      );
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar logout={this.props.logout} title={'Lista kursów'} returnLink={'/'} />
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
                onClick: (event, d) => this.setRedirectedParams(d),
              },
            ]}
            options={{
              actionsColumnIndex: -1,
            }}
            localization={{
              pagination: {
                labelDisplayedRows: '{from}-{to} z {count}',
                labelRowsSelect: 'wyników',
                firstAriaLabel: 'Pierwsza strona',
                firstTooltip: 'Pierwsza strona',
                previousAriaLabel: 'Poprzednia strona',
                previousTooltip: 'Poprzednia strona',
                nextAriaLabel: 'Następna strona',
                nextTooltip: 'Następna strona',
                lastAriaLabel: 'Ostatnia strona',
                lastTooltip: 'Ostatnia strona',
              },
              toolbar: {
                nRowsSelected: 'Wybrano {0} pozycji',
                searchPlaceholder: 'Wyszukaj',
              },
              header: {
                actions: 'Opcje',
              },
              body: {
                emptyDataSourceMessage: 'Brak danych',
                filterRow: {
                  filterTooltip: 'Filtruj',
                },
              },
            }}
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  courses: state.course.courses,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default compose(
  connect(mapStateToProps, { getCourses, logout }),
  withStyles(styles),
)(GetCourses);
