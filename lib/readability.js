'use strict';

const co        = require('co');
const entities  = require('entities');
const got       = require('got');

module.exports = function (url, token) {
  return co(function* () {
    if (!token) {
      return yield Promise.reject(new Error('Missing token Readability'));
    }

    const readabilityUrl = `https://www.readability.com/api/content/v1/parser?` +
      `token=${token}&url=${url}`;

    const res = yield got(readabilityUrl);
    const body = JSON.parse(res.body);
    return entities.decodeXML(body.content);
  });
};
