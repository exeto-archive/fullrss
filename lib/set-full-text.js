'use strict';

const { mercury, forEachP, createHash } = require('./utils');

const cacheStub = { get() {}, set() {} };

module.exports = async ({ feed, token, cache = cacheStub }) => {
  await forEachP(feed.items, async item => {
    const date = item.date_modified || item.date_published;
    const key = createHash(`${item.id}:${date}`);
    const cachedData = await cache.get(key);
    const { excerpt, content } = cachedData || (await mercury(token, item.url));

    if (!cachedData) {
      cache.set(key, { excerpt, content });
    }

    item.summary = excerpt;
    item.content_html = content;
  });

  return feed;
};
