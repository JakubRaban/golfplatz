
const isObject = (value) => value && typeof value === 'object' && value.constructor === Object;
const isArray = (value) => Array.isArray(value);
const isString = (value) => typeof value === 'string' || value instanceof String;

const extractDjangoErrors = (djangoErrors, outputErrors = []) => {
  if(isObject(djangoErrors)) {
    for(let value of Object.values(djangoErrors)) {
      extractDjangoErrors(value, outputErrors);
    }
  } else if(isArray(djangoErrors)) {
    for (let value of djangoErrors) {
      extractDjangoErrors(value, outputErrors);
    }
  } else if(isString(djangoErrors)) {
    outputErrors.push(djangoErrors);
  }
  return outputErrors;
}
