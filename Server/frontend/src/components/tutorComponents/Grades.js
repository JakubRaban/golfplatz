import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import compose from 'recompose/compose';
import { CssBaseline, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { saveAs } from 'file-saver';

import { getCourseGrades, exportGrades } from '../../actions/course.js';
import { logout } from '../../actions/auth.js';
import { styles } from '../../styles/style.js';
import NavBar from '../common/navbars/NavBar.js';

export class Grades extends Component {
  state = { columns: [{ title: 'Student', field: 'studentName' }], data: [], loaded: false };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.any,
  };

  componentDidMount() {
    this.props.getCourseGrades(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.courseGrades !== this.props.courseGrades) {
      this.mapToColumns();
      this.setState({ loaded: true });
    }
  }

  mapToColumns = () => {
    const data = [];
    const columns = [...this.state.columns];
    this.props.courseGrades.chapters.forEach((chapter, index) => {
      columns.push({ title: chapter, field: `chapter${index}`});
    })
    this.props.courseGrades.studentsScores.map((score) => {
      const row = {
        studentName: score.username, 
      }

      this.props.courseGrades.chapters.forEach((chapter, index) => {
        const studentScore = score[chapter];
        console.log(studentScore);
        row[`chapter${index}`] = studentScore === undefined ? 'Nie ukończył' : `${studentScore}%`;
      });
      
      data.push(row);
    });
    this.setState({ data, columns, loaded: true });
  }

  getCourseName() {
    const name = this.props.courseGrades?.courseName || '';
    return `Oceny studentów - ${name}`;
  }

  export = async () => {
    await this.props.exportGrades(this.props.match.params.id);
    saveAs(this.props.csv, `wyniki-${this.props.courseGrades?.courseName}.csv`);
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
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
        <NavBar logout={this.props.logout} title={this.getCourseName()} returnLink={'/'} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <>
            {this.state.loaded &&
            <>
              {this.props.courseGrades.studentsScores.length === 0 ?
                <Typography component='h6' variant='h6'>Żaden z uczestników kursu nie ukończył jeszcze ani jednego rozdziału</Typography> :
                <MaterialTable
                  title="Bohaterowie minionych epok"
                  columns={this.state.columns}
                  data={this.state.data}
                  options={{
                    actionsColumnIndex: -1,
                    exportButton: true,
                    exportCsv: () => this.export(),
                    pageSize: this.props.courseGrades.studentsScores.length,
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
                      exportTitle: 'Wyeksportuj',
                      exportAriaLabel: 'Wyeksportuj',
                      exportName: 'Eksportuj jako CSV',
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
                />}
            </>
          }
          </>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  courseGrades: state.course.courseGrades,
  csv: state.course.csv,
});

export default compose(
  connect(mapStateToProps, { logout, getCourseGrades, exportGrades }),
  withStyles(styles),
)(Grades);
