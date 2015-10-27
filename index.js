'use strict';

const co           = require('co');
const feedParse    = require('./lib/feed-parse');
const generateFeed = require('./lib/generate-feed');

module.exports = function (args) {
  return co(function* () {
    const result = yield feedParse(args.feed, args.max);
    return yield generateFeed(result, args.elements, args.dropElements,
      args.token, args.pureHtml);
  });
};
