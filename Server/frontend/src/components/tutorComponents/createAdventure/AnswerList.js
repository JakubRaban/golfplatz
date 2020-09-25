import { Button } from '@material-ui/core';
import React from 'react';

import Answer from './Answer.js';

class AnswerList extends React.Component {
  handleAddAnswer = () => {
    this.props.addAnswer(this.props.questionIndex);
  }

  render() {
    const { answers, questionType } = this.props.question;
    return (
      <>
        <div>Odpowiedzi:</div>
        <div>
          {answers.map((answer, index) =>
            <Answer key={index} answer={answer} answerIndex={index} updateAnswer={this.props.updateAnswer} questionType={questionType} questionIndex={this.props.questionIndex}/>,
          )}
        </div>
        <Button onClick={this.handleAddAnswer}>Dodaj kolejną odpowiedź</Button>
      </>
    );
  }
}

export default AnswerList;
