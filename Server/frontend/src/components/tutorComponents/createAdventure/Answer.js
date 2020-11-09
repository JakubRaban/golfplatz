import { Button, Checkbox, TableCell, TableRow, TextField } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import compose from 'recompose/compose.js';
import { get } from 'lodash';

import { styles } from '../../../styles/style.js';

class Answer extends React.Component {
  handleChange = (e) => {
    this.props.updateAnswer(this.props.questionIndex, this.props.answerIndex,
      { [e.target.name]: ['isCorrect', 'isRegex'].includes(e.target.name) ? e.target.checked : e.target.value });
  }

  handleDelete = () => {
    this.props.deleteAnswer(this.props.questionIndex, this.props.answerIndex);
  }

  render() {
    const { answer, questionIndex, answerIndex } = this.props;
    const isOpenQuestion = this.props.questionType === 'OPEN';
    const isMultiline = this.props.inputType === 'TEXTAREA';
    return (
      <TableRow>
        <TableCell>
          <TextField value={answer.text} onChange={this.handleChange} name={'text'} multiline={isMultiline} rows={isMultiline ? 4 : 1}
            label={`${isOpenQuestion ? 'Prawidłowa odpowiedź' : 'Wariant odpowiedzi'} ${this.props.answerIndex + 1}`}
            error={get(this.props.errors, `questions[${questionIndex}].answers[${answerIndex}].text`, false)}
            helperText={get(this.props.errors, `questions[${questionIndex}].answers[${answerIndex}].text`, '')}/>
        </TableCell>
        {!isOpenQuestion &&
          <TableCell>
            <Checkbox checked={answer.isCorrect} onChange={this.handleChange} name={'isCorrect'}/>
          </TableCell>
        }
        {isOpenQuestion && <TableCell>
          <Checkbox checked={answer.isRegex} onChange={this.handleChange} name={'isRegex'} />
        </TableCell>}
        <TableCell>
          <Button size={'small'} variant={'contained'} color={'secondary'} onClick={this.handleDelete}>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default compose(withStyles(styles))(Answer);
