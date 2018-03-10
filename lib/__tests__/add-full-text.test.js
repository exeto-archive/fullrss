'use strict';

const addFullText = require('../add-full-text');
const utils = require('../utils');

jest.mock('../utils', () => {
  const actualUtils = require.requireActual('../utils');

  return {
    createHash: jest.spyOn(actualUtils, 'createHash'),
    mapP: jest.spyOn(actualUtils, 'mapP'),

    mercury: jest.fn(() =>
      Promise.resolve({ excerpt: 'excerpt', content: 'content' }),
    ),
  };
});

beforeEach(() => jest.clearAllMocks());

const feed = {
  items: [
    {
      id: '42',
      url: 'url1',
      date_published: 'date_published',
    },
    {
      id: '84',
      url: 'url2',
      date_published: 'date_published',
    },
  ],
};

test('it should set the full text in each item', async () => {
  const data = await addFullText({ feed });

  expect(data).toEqual({
    items: [
      {
        ...feed.items[0],
        content_html: 'content',
        summary: 'excerpt',
      },
      {
        ...feed.items[1],
        content_html: 'content',
        summary: 'excerpt',
      },
    ],
  });
});

test('it checks the passed arguments in mapP', async () => {
  await addFullText({ feed });

  expect(utils.mapP).toHaveBeenCalledTimes(1);
  expect(utils.mapP).toHaveBeenCalledWith(feed.items, expect.any(Function));
});

test('it checks the passed arguments in createHash', async () => {
  await addFullText({ feed: { items: [feed.items[0]] } });

  expect(utils.createHash).toHaveBeenCalledTimes(1);
  expect(utils.createHash).toHaveBeenCalledWith('42:date_published');

  await addFullText({
    feed: { items: [{ ...feed.items[0], date_modified: 'date_modified' }] },
  });

  expect(utils.createHash).toHaveBeenCalledTimes(2);
  expect(utils.createHash).toHaveBeenCalledWith('42:date_modified');
});

test('it checks the passed arguments in mercury', async () => {
  await addFullText({ feed, token: 'token' });

  expect(utils.mercury).toHaveBeenCalledTimes(2);
  expect(utils.mercury).toHaveBeenLastCalledWith('token', 'url2');
});

test('it should check the cache operation', async () => {
  const cache = {
    get: jest.fn(),
    set: jest.fn(),
  };

  await addFullText({ feed, cache });

  expect(cache.get).toHaveBeenCalledTimes(2);
  expect(cache.set).toHaveBeenCalledTimes(2);

  expect(cache.get.mock.calls).toEqual([
    ['ad80f2c9acabba91f51ad6c53300cf1b'],
    ['3170bff908564427e844bc1aed66498f'],
  ]);

  const mercuryResult = { excerpt: 'excerpt', content: 'content' };

  expect(cache.set.mock.calls).toEqual([
    ['ad80f2c9acabba91f51ad6c53300cf1b', mercuryResult],
    ['3170bff908564427e844bc1aed66498f', mercuryResult],
  ]);

  jest.clearAllMocks();

  cache.get.mockImplementation(() => ({
    excerpt: 'cache-excerpt',
    content: 'cache-content',
  }));

  const data = await addFullText({ feed, cache });

  expect(cache.get).toHaveBeenCalledTimes(2);
  expect(cache.set).not.toHaveBeenCalled();

  expect(data).toEqual({
    items: [
      {
        ...feed.items[0],
        content_html: 'cache-content',
        summary: 'cache-excerpt',
      },
      {
        ...feed.items[1],
        content_html: 'cache-content',
        summary: 'cache-excerpt',
      },
    ],
  });
});
