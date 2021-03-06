import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { Typography } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';

export class Ranking extends Component {
  state = { data: [], loaded: false };
  columns = [
    { title: 'Pozycja', field: 'position' },
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
    const participantAndTopMode = this.props.ranking.studentRankingVisibility === 'PARTICIPANT_AND_TOP';
    const highestRank = this.props.ranking.ranking[0].studentScore.rank.name;

    this.props.ranking.ranking.map((r) => {
      const isHighestRank = r.studentScore.rank.name === highestRank; 
      data.push({
        position: r.position,
        studentName: `${r.student.firstName} ${r.student.lastName}`,
        courseGroupName: r.courseGroupName,
        scorePercent: !participantAndTopMode || isHighestRank ? r.studentScore.scorePercent : '-',
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
            columns={this.columns.filter((column) => column.field !== 'rank' || this.props.ranks.length > 0)}
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

const mapStateToProps = (state) => ({
  ranks: state.course.ranks,
})

export default connect(mapStateToProps)(Ranking);
