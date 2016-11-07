'use strict';

const feedParse = require('./feedParse');
const generateFeed = require('./generateFeed');

module.exports = function fullrss(args) {
  return feedParse(args)
    .then(result => generateFeed(result, args));
};
