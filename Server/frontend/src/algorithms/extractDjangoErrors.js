
const isObject = (value) => value && typeof value === 'object' && value.constructor === Object;
const isArray = (value) => Array.isArray(value);
const isString = (value) => typeof value === 'string' || value instanceof String;

const extractDjangoErrors = (djangoErrors, outputErrors = []) => {
  if(isObject(djangoErrors)) {
    for(let value of Object.values(djangoErrors)) {
      console.log("object", value)
      extractDjangoErrors(value, outputErrors);
    }
  } else if(isArray(djangoErrors)) {
    console.log("array", djangoErrors)
    for (let value of djangoErrors) {
      extractDjangoErrors(value, outputErrors);
    }
  } else if(isString(djangoErrors)) {
    console.log("string", djangoErrors)
    outputErrors.push(djangoErrors);
  }
  return outputErrors;
}
