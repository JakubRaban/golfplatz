import { Button, withStyles } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { fromServerForm } from '../clientServerTranscoders/adventureTranscoder.js';
import { styles } from '../styles/style.js';

export class AdventuresList extends Component {
  state = { chosenAdventureId: -1 };

  columns = [
    { title: 'ID przygody', field: 'id', type: 'numeric' },
    { title: 'Nazwa', field: 'name' },
    { title: 'Opis', field: 'description' },
    { title: 'Utworzono', field: 'createdOn', type: 'date' },
  ];

  setRedirectedParams(d) {
    this.setState({
      chosenAdventureId: d.id,
    });
  }

  render() {
    if (this.state.chosenAdventureId !== -1) {
      const url = `/adventure/${this.state.chosenAdventureId}`;
      return (
        <Redirect to={
          {
            pathname: url,
            state: {
              adventure: fromServerForm(this.props.adventures.find((adventure) => adventure.id === this.state.chosenAdventureId)),
            },
          }
        }/>
      );
    }
    return (
      <>
        <MaterialTable
          title="Obejrzyj lub edytuj stworzone przygody"
          columns={this.columns}
          data={this.props.adventures}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Zobacz/edytuj informacje o przygodzie',
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
        <Button
          variant='outlined'
          color='primary'
          component={Link}
          to={'/adventure/add'}
        >Dodaj przygodę
        </Button>
      </>
    );
  }
}

export default withStyles(styles)(AdventuresList);

