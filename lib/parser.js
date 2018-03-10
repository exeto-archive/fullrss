'use strict';

const got = require('got');
const FeedParser = require('feedparser');

const headers = require('./headers');

module.exports = (url, max = 0) =>
  new Promise((resolve, reject) => {
    const parser = new FeedParser({ addmeta: false });
    const feed = got.stream(url, { headers });
    const items = [];

    parser.on('data', item => {
      if (max === 0 || items.length < max) {
        items.push(item);
      } else {
        parser.emit('end');
      }
    });

    parser.on('end', () => {
      resolve({
        meta: parser.meta,
        items,
      });
    });

    parser.on('error', reject);
    feed.on('error', reject);

    feed.pipe(parser);
  });
