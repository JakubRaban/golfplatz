import React from 'react'
import {InputLabel, TextField} from "@material-ui/core";
import {get} from "lodash";
import Typography from "@material-ui/core/Typography";

class AddWeights extends React.Component {
  render() {
    const {weights, handleWeightChange, errors} = this.props;
    return (
      <div style={{margin: '10px'}}>
        <Typography variant="h6" gutterBottom>
          Określ wagi kategorii przygód:
        </Typography>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Kartkówka:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={weights.QUIZ} type="number"
                       error={get(errors, `weights.QUIZ`, false)} name="QUIZ"
                       helperText={get(errors, `weights.QUIZ`, '')} variant="outlined"
                       onChange={(e) => handleWeightChange(e.target.name, e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Kolokwium:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={weights.TEST} type="number"
                       error={get(errors, `weights.TEST`, false)} name="TEST"
                       helperText={get(errors, `weights.TEST`, '')} variant="outlined"
                       onChange={(e) => handleWeightChange(e.target.name, e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Zwykłe zadanie:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={weights.GENERIC} type="number"
                       error={get(errors, `weights.GENERIC`, false)} name="GENERIC"
                       helperText={get(errors, `weights.GENERIC`, '')} variant="outlined"
                       onChange={(e) => handleWeightChange(e.target.name, e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Praca domowa:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={weights.HOMEWORK} type="number"
                       error={get(errors, `weights.HOMEWORK`, false)} name="HOMEWORK"
                       helperText={get(errors, `weights.HOMEWORK`, '')} variant="outlined"
                       onChange={(e) => handleWeightChange(e.target.name, e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <InputLabel className="label-class">Aktywność:</InputLabel>
          </div>
          <div className="col-75">
            <TextField className="input-class" value={weights.ACTIVENESS} type="number"
                       error={get(errors, `weights.ACTIVENESS`, false)} name="ACTIVENESS"
                       helperText={get(errors, `weights.ACTIVENESS`, '')} variant="outlined"
                       onChange={(e) => handleWeightChange(e.target.name, e.target.value)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default AddWeights;
