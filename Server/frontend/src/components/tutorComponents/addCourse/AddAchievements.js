import '../../../styles/course-forms.css';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';

import Achievement from './Achievement.js';


export class AddAchievements extends Component {
  render() {
    return (
      <div style={{ margin: '10px' }}>
        <Typography variant="h6" gutterBottom>
          Konfiguracja odznak:
        </Typography>
        {this.props.achievements.map((achievement, index) =>
          <Achievement
            achievement={achievement}
            handleChange={this.props.handleAchievementChange}
            index={index}
            key={index} />,
        )}
        <Button
          color="secondary"
          variant='outlined'
          onClick={this.props.addNewAchievement}
        >Dodaj odznaki</Button>
      </div>
    );
  }
}

export default AddAchievements;
