import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';

export class Ranking extends Component {
  state = { data: [], loaded: false };
  columns = [
    { title: 'Student', field: 'studentName' },
    { title: 'Grupa', field: 'courseGroupName' },
    { title: 'Ranga', field: 'rank' },
    { title: 'Aktualny wynik procentowy', field: 'scorePercent' },
    { title: 'Przebyte rozdziały', field: 'chaptersDone' },
  ];

  componentDidMount() {
    if (!isEmpty(this.props.ranking)) {
      this.mapToColumns();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.ranking !== prevProps.ranking) {
      this.mapToColumns();
    }
  }

  mapToColumns = () => {
    const data = [];
    this.props.ranking.ranking.map((r) => {
      data.push({
        studentName: `${r.student.firstName} ${r.student.lastName}`,
        courseGroupName: r.courseGroupName,
        scorePercent: r.studentScore.scorePercent,
        chaptersDone: r.studentScore.chaptersDone,
        rank: r.studentScore.rank ? <img alt={r.studentScore.rank.name} src={r.studentScore.rank.image} style={{ height: '50px', width: '50px' }} title={r.studentScore.rank.name} /> : null,
      })
    });
    this.setState({ data, loaded: true });
  }

  render() {
    return (
      <>
        {this.state.loaded &&
        <>
          {this.props.ranking.ranking.length === 0 ?
          <Typography component='h6' variant='h6'>Tutaj pojawi się ranking walczących</Typography> :
          <MaterialTable
            title="Bohaterowie minionych epok"
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

export default Ranking;
