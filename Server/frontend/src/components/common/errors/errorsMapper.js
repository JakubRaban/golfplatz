import { extractDjangoErrors } from './extractDjangoErrors.js';

const errorMapper = {
  'You do not have permission to perform this action.': 'Niepoprawne dane logowania',
  'Enter a valid email address.': 'Podaj poprawny adres e-mail',
  'user with this email address already exists.': 'Użytkownik z tym adresem e-mail już istnieje'
}

export const printError = (requestResponse) => {
  const djangoError = extractDjangoErrors(requestResponse);
  return errorMapper[djangoError] || djangoError;
}