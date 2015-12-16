'use strict';

const co          = require('co');
const RSS         = require('rss');
const getFullText = require('./get-full-text');

module.exports = function (parsedFeed, args) {
  return co(function* () {
    const feed = new RSS({
      title: parsedFeed.meta.title,
      site_url: parsedFeed.meta.link,
      language: parsedFeed.meta.language,
      pubDate: parsedFeed.meta.date,
    });

    let count = parsedFeed.articles.length;

    for (const i of parsedFeed.articles) {
      const body = yield getFullText(i.link, args);

      feed.item({
        title: i.title,
        description: body,
        url: i.link,
        author: i.author,
        date: i.date,
      });

      count--;

      if (count === 0) {
        return feed.xml({ indent: '  ' });
      }
    }
  });
};
