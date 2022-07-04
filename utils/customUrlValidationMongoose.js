const { REGEXP_URL } = require('./constants');

const customUrlValidationMongoose = (url) => REGEXP_URL.test(url);

module.exports = customUrlValidationMongoose;
