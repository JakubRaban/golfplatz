
export const toServerForm = (adventure) => {
  const result = { name: adventure.name, taskDescription: adventure.taskDescription };
  result.timeLimit = adventure.hasTimeLimit ? adventure.timeLimit : 0;
  result.timerRules = adventure.timerRulesEnabled ? adventure.timerRules : [];
  result.pointSource = {};
  result.pointSource.category = adventure.category;
  result.pointSource.questions = adventure.questions;
  for (const question of result.pointSource.questions) {
    question.isMultipleChoice = question.answers.filter((answer) => answer.isCorrect).length > 1;
  }
  return result;
};
