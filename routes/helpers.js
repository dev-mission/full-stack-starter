'use strict';

const _ = require('lodash');
const inflection = require('inflection');

module.exports.register = function(res, errors) {
  res.locals.inflection = inflection;

  const hasError = function(name) {
    return _.find(errors, e => e.path == name) !== undefined;
  };
  res.locals.hasError = hasError;

  const errorMessages = function(name) {
    return _.uniq(_.map(_.filter(errors, e => e.path == name), e => e.message));
  };
  res.locals.errorMessages = errorMessages;

  res.locals.renderErrorMessages = function(name) {
    if (hasError(name)) {
      return `<div class="invalid-feedback d-block">${inflection.capitalize(errorMessages(name).join(', '))}.</div>`
    }
    return '';
  }
}
