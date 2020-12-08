import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';

export class GradesDetails extends Component {
  state = { columns: [{ title: 'Student', field: 'studentName' }], data: [], loaded: false };

  componentDidMount() {
    if (!isEmpty(this.props.courseGrades)) {
      this.mapToColumns();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.courseGrades !== prevProps.courseGrades) {
      this.mapToColumns();
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

  render() {
    return (
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
                exportCsv: () => this.props.export(),
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
    );
  }
}

export default GradesDetails;
