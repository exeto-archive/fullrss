'use strict';

const co        = require('co');
const entities  = require('entities');
const coRequest = require('./co-request');

module.exports = function(url, token) {
  return co(function*() {
    if (!token) {
      return yield Promise.reject(new Error('Missing token Readability'));
    }

    url = 'https://www.readability.com/api/content/v1/parser?' +
          'token=' + token + '&url=' + url;

    let res = yield coRequest(url);
    let body = JSON.parse(res.body);
    return entities.decodeXML(body.content);
  });
};
