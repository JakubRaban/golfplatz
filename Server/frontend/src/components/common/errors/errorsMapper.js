import { extractDjangoErrors } from './extractDjangoErrors.js';

const errorMapper = {
  'You do not have permission to perform this action.': 'Niepoprawne dane logowania',
}

export const printError = (requestResponse) => {
  const djangoError = extractDjangoErrors(requestResponse);
  return errorMapper[djangoError];
}