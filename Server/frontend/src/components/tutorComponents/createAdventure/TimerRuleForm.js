import { Button, MenuItem, Select, TableCell, TableRow, TextField, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

class TimerRuleForm extends React.Component {
  handleChange = (e) => {
    this.props.updateTimerRule(this.props.index, { [e.target.name]: e.target.value });
  }

  handleDelete = (e) => {
    this.props.deleteTimerRule(this.props.index);
  }

  render() {
    const { prevRule, timerRule } = this.props;
    return (
      <TableRow>
        <TableCell>
          {!prevRule ?
            <Typography>Jeśli uczestnik odpowie w ciągu <TextField name={'ruleEndTime'} value={timerRule.ruleEndTime}
              onChange={this.handleChange}
              label={'Czas w sek.'}/> sekund, otrzyma <TextField
              label={'Procent punktów'} name={'leastPointsAwardedPercent'} onChange={this.handleChange}
              value={timerRule.leastPointsAwardedPercent}/>% punktów</Typography> :
            <Typography>W przeciwnym wypadku, jeśli uczestnik odpowie w czasie od {prevRule.ruleEndTime} do <TextField
              label={'Czas w sek.'} name={'ruleEndTime'} value={timerRule.ruleEndTime}
              onChange={this.handleChange}/> sekund,{' '}
            <Select name={'decreasingMethod'} value={timerRule.decreasingMethod} onChange={this.handleChange}>
              <MenuItem value={'NONE'}>otrzyma</MenuItem>
              <MenuItem value={'LIN'}>ilość otrzymanych punktów będzie zmniejszała się równomiernie</MenuItem>
            </Select>
            {timerRule.decreasingMethod === 'NONE' ?
              <><TextField label={'Procent punktów'} value={timerRule.leastPointsAwardedPercent}
                name={'leastPointsAwardedPercent'} onChange={this.handleChange}/>% punktów</> :
              <>od {prevRule.leastPointsAwardedPercent}% do <TextField label={'Procent punktów'}
                value={timerRule.leastPointsAwardedPercent}
                name={'leastPointsAwardedPercent'}
                onChange={this.handleChange}/>% punktów</>
            }
            </Typography>
          }
        </TableCell>
        <TableCell>
          <Button size={'small'} variant={'contained'} color={'secondary'} onClick={this.handleDelete}>
            <DeleteIcon/>
          </Button>
        </TableCell>
      </TableRow>
    );
  }
}

export default TimerRuleForm;
