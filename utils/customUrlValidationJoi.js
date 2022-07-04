const { REGEXP_URL } = require('./constants');

const customUrlValidationJoi = (url, helpers) => {
  if (REGEXP_URL.test(url)) {
    return url;
  }
  return helpers.error('Не правельный URL');
};

module.exports = customUrlValidationJoi;
