import Typography from "@material-ui/core/Typography";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import React from "react";

const SelectRankingMode = ({ rankingMode, handleChange }) => {
  return (
    <div style={{margin: '10px'}}>
      <Typography variant="h6" gutterBottom>
        Wybierz tryb widoczności rankingu u uczestników:
      </Typography>
      <Select value={rankingMode} onChange={handleChange} variant="outlined">
        <MenuItem value={'FULL'}>Pełny ranking</MenuItem>
        <MenuItem value={'PARTICIPANT_AND_TOP'}>Wynik danego uczestnika, najbliższych konkurentów i czołówki</MenuItem>
        <MenuItem value={'PARTICIPANT'}>Wynik danego uczestnika i najbliższych konkurentów</MenuItem>
        <MenuItem value={'OFF'}>Ranking wyłączony</MenuItem>
      </Select>
    </div>
  )
}

export default SelectRankingMode;
