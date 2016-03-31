'use strict';

const co = require('co');
const RSS = require('rss');

const FullText = require('./FullText');

module.exports = function generateFeed(parsedFeed, args) {
  const fullText = new FullText(args);
  const feed = new RSS({
    title: parsedFeed.meta.title,
    site_url: parsedFeed.meta.link,
    language: parsedFeed.meta.language,
    pubDate: parsedFeed.meta.date,
  });

  let count = parsedFeed.articles.length;

  return co(function* () {
    for (const i of parsedFeed.articles) {
      const body = yield fullText.get(i.link);

      feed.item({
        title: i.title,
        description: body,
        url: i.link,
        author: i.author,
        date: i.date,
      });

      count--;

      if (count === 0) {
        break;
      }
    }

    return feed.xml({ indent: '  ' });
  });
};
