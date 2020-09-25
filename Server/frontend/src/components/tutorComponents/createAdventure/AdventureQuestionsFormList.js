import { Box, Button, Grid } from '@material-ui/core';
import React from 'react';

import AdventureQuestionForm from './AdventureQuestionForm.js';

class AdventureQuestionsFormList extends React.Component {
  handleAddQuestion = () => {
    this.props.addQuestion();
  }

  render() {
    return (
      <Grid container spacing={1}>
        {this.props.questions.map((question, index) =>
          <Grid item key={index} sm={6}>
            <Box border={1} borderColor={'grey.500'} borderRadius={8}>
              <AdventureQuestionForm key={index} index={index} question={question} updateQuestion={this.props.updateQuestion} deleteQuestion={this.props.deleteQuestion}
                addAnswer={this.props.addAnswer} updateAnswer={this.props.updateAnswer} deleteAnswer={this.props.deleteAnswer}/>
            </Box>
          </Grid>,
        )}
        <Button onClick={this.handleAddQuestion}>Dodaj kolejne pytanie</Button>
      </Grid>
    );
  }
}

export default AdventureQuestionsFormList;
