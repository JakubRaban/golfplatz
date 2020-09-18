import { Box, Button, Grid } from '@material-ui/core';
import React from 'react';

import AdventureQuestionForm from './AdventureQuestionForm.js';

class AdventureQuestionsFormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionForms: [<AdventureQuestionForm key={0} index={0} emptyQuestion={this.props.emptyQuestion} updateQuestion={this.props.updateQuestion}/>],
    };
  }

  handleAddQuestion = () => {
    this.props.addQuestion();
    const questionForms = [...this.state.questionForms];
    questionForms.push(<AdventureQuestionForm key={this.state.questionForms.length} index={this.state.questionForms.length}
      emptyQuestion={this.props.emptyQuestion} updateQuestion={this.props.updateQuestion}/>);
    this.setState({ questionForms });
  }

  render() {
    return (
      <Grid container spacing={1}>
        {this.state.questionForms.map((form, index) =>
          <Grid item key={index} sm={6}>
            <Box border={1} borderColor={'grey.500'} borderRadius={8}>
              {form}
            </Box>
          </Grid>,
        )}
        <Button onClick={this.handleAddQuestion}>Dodaj kolejne pytanie</Button>
      </Grid>
    );
  }
}

export default AdventureQuestionsFormList;
