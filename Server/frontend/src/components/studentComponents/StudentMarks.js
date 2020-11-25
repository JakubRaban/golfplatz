import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { isNil } from 'lodash';

export class StudentMarks extends Component {
  state = { data: [], loaded: false };
  columns = [
    { title: 'Rozdział', field: 'chapterName' },
    { title: 'Uzyskany wynik', field: 'score' },
    { title: 'Maksymalny możliwy wynik', field: 'maxScore' },
    { title: 'Ukończono', field: 'finishTime' },
  ];

  componentDidMount() {
    if (!isNil(this.props.marks)) {
      this.mapToColumns();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.marks !== prevProps.marks) {
      this.mapToColumns();
    }
  }

  mapToColumns = () => {
    const data = [];
    this.props.marks.map((mark) => {
      data.push({
        chapterName: mark.name,
        score: mark.pointsScored,
        maxScore: mark.pointsForMaxGrade,
        finishTime: new Date(mark.timeCompleted).toLocaleString('pl-PL'),
      })
    });
    this.setState({ data, loaded: true });
  }

  render() {
    console.log(this.props);
    return (
      <>
        {this.state.loaded &&
        <>
          {this.props.marks.length === 0 ?
          <Typography component='h6' variant='h6'>Nie ukończyłeś jeszcze żadnego rozdziału</Typography> :
          <MaterialTable
              title="Zadowolony?"
              columns={this.columns}
              data={this.state.data}
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
          }
        </>
      }
      </>
    );
  }
}

export default StudentMarks;
