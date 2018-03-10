'use strict';

const { mercury, mapP, createHash } = require('./utils');

const cacheStub = { get() {}, set() {} };

module.exports = async ({ feed, token, cache = cacheStub }) => {
  const items = await mapP(feed.items, async item => {
    const date = item.date_modified || item.date_published;
    const key = createHash(`${item.id}:${date}`);
    const cachedData = await cache.get(key);
    const { excerpt, content } = cachedData || (await mercury(token, item.url));

    if (!cachedData) {
      cache.set(key, { excerpt, content });
    }

    return {
      ...item,
      summary: excerpt,
      content_html: content,
    };
  });

  return {
    ...feed,
    items,
  };
};
