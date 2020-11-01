import {Button, FormControlLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import React from 'react';

import TimerRuleForm from './TimerRuleForm.js';

class TimerRulesFormList extends React.Component {
  handleTimerRulesEnabled = (e) => {
    this.props.enableTimerRules(e.target.checked);
  }

  handleAddTimerRule = () => {
    this.props.addTimerRule();
  }

  render() {
    return (
      <>
        <FormControlLabel control={<Switch checked={this.props.timerRulesEnabled} onChange={this.handleTimerRulesEnabled}/>}
          label={'Przyznawaj różną ilość punktów w zależności od czasu rozwiązania'} />
        {this.props.timerRulesEnabled &&
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reguła</TableCell>
                  <TableCell>Usuń</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.timerRules.map((timerRule, index, timerRules) =>
                  <TimerRuleForm timerRule={timerRule} prevRule={index > 0 ? timerRules[index - 1] : undefined} key={index} index={index}
                    updateTimerRule={this.props.updateTimerRule} deleteTimerRule={this.props.deleteTimerRule}
                    errors={this.props.errors}/>,
                )}
              </TableBody>
            </Table>
            <Button onClick={this.handleAddTimerRule}>Dodaj kolejną regułę</Button>
          </>
        }
      </>
    );
  }
}

export default TimerRulesFormList;
