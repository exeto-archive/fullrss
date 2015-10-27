'use strict';

const co           = require('co');
const feedParse    = require('./lib/feed-parse');
const generateFeed = require('./lib/generate-feed');

module.exports = function (args) {
  return co(function* () {
    const result = yield feedParse(args);
    return yield generateFeed(result, args);
  });
};
