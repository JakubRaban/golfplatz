import { Button, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import React from 'react';
import compose from 'recompose/compose.js';

import { styles } from '../../../styles/style.js';
import Answer from './Answer.js';

class AnswerList extends React.Component {
  handleAddAnswer = () => {
    this.props.addAnswer(this.props.questionIndex);
  }

  render() {
    const { answers, questionType, inputType } = this.props.question;
    const { classes } = this.props;
    return (
      <>
        <div>Odpowiedzi:</div>
        <Table className={classes.table} size={'small'}>
          <TableHead>
            <TableRow>
              <TableCell>Treść odpowiedzi</TableCell>
              {questionType === 'CLOSED' && <TableCell>Poprawna?</TableCell>}
              {questionType === 'OPEN' && <TableCell>Jest regexem?</TableCell>}
              <TableCell>Usuń</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answers.map((answer, index) =>
              <Answer key={index} answer={answer} answerIndex={index} questionType={questionType} inputType={inputType}
                questionIndex={this.props.questionIndex} updateAnswer={this.props.updateAnswer} deleteAnswer={this.props.deleteAnswer}/>,
            )}
          </TableBody>
        </Table>
        <Button onClick={this.handleAddAnswer}>Dodaj kolejną odpowiedź</Button>
      </>
    );
  }
}

export default compose(withStyles(styles))(AnswerList);
