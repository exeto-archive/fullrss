'use strict';

const feedParse = require('./feed-parse');
const generateFeed = require('./generate-feed');

module.exports = async function(args) {
  const parsedFeed = await feedParse(args);

  return generateFeed(parsedFeed, args);
};
