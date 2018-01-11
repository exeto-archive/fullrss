'use strict';

const Feed = require('rss');

const FullText = require('./full-text');

module.exports = async function generateFeed(parsedFeed, args) {
  const fullText = new FullText(args);
  const feed = new Feed({
    title: parsedFeed.meta.title,
    site_url: parsedFeed.meta.link,
    language: parsedFeed.meta.language,
    pubDate: parsedFeed.meta.date,
  });

  for (const article of parsedFeed.articles) {
    if (article) {
      const body = await fullText.get(article.link);

      feed.item({
        title: article.title,
        description: body,
        url: article.link,
        author: article.author,
        date: article.date,
      });
    }
  }

  return feed.xml({ indent: '  ' });
};
