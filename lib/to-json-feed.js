'use strict';

const { filterEmptyFields } = require('./utils');

const processItem = item => {
  const datePublished = item.pubdate.toISOString();
  const dateModified = item.date.toISOString();

  return filterEmptyFields({
    id: item.guid,
    url: item.link,
    title: item.title,
    date_published: datePublished,
    date_modified: dateModified !== datePublished ? dateModified : null,
    author: item.author ? { name: item.author } : null,
  });
};

module.exports = ({ meta, items }) =>
  filterEmptyFields({
    version: 'https://jsonfeed.org/version/1',
    title: meta.title,
    home_page_url: meta.link,
    feed_url: meta.xmlurl,
    description: meta.description,
    author: meta.author ? { name: meta.author } : null,
    items: items.map(processItem),
  });
