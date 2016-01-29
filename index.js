'use strict';

const feedParse    = require('./lib/feedParse');
const generateFeed = require('./lib/generateFeed');

module.exports = function fullrss(args) {
  return feedParse(args)
    .then(result => generateFeed(result, args));
};
