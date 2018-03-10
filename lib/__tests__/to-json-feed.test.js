'use strict';

const toJsonFeed = require('../to-json-feed');
const { filterEmptyFields } = require('../utils');

jest.mock('../utils', () => ({
  filterEmptyFields: jest.spyOn(
    require.requireActual('../utils'),
    'filterEmptyFields',
  ),
}));

beforeEach(() => jest.clearAllMocks());

const meta = {
  title: 'fullrss',
  link: 'http://domain.com',
  xmlurl: 'http://domain.com/feed',
  description: 'Description',
};

const item = {
  guid: '52384bd2-c094-4d48-98ac-4471b835980a',
  title: 'Ius et delenit tincidunt expetendis',
  url: 'http://domain.com/post/1.html',
  pubdate: new Date('2015-12-13T08:50:49.000Z'),
  date: new Date('2015-12-13T08:50:49.000Z'),
};

test('it should check the transform to json feed', () => {
  const receivedMeta = {
    version: 'https://jsonfeed.org/version/1',
    title: 'fullrss',
    description: 'Description',
    feed_url: 'http://domain.com/feed',
    home_page_url: 'http://domain.com',
  };

  const receivedItem = {
    id: '52384bd2-c094-4d48-98ac-4471b835980a',
    title: 'Ius et delenit tincidunt expetendis',
    date_published: '2015-12-13T08:50:49.000Z',
  };

  const recivied1 = toJsonFeed({ meta, items: [item] });

  const expected1 = {
    ...receivedMeta,
    items: [receivedItem],
  };

  expect(recivied1).toEqual(expected1);

  const recivied2 = toJsonFeed({
    meta: {
      ...meta,
      author: 'Lorem inc.',
    },
    items: [
      {
        ...item,
        author: 'John Smith',
        date: new Date('2015-12-14T08:50:49.000Z'),
      },
    ],
  });

  const expected2 = {
    ...receivedMeta,
    author: { name: 'Lorem inc.' },
    items: [
      {
        ...receivedItem,
        author: { name: 'John Smith' },
        date_modified: '2015-12-14T08:50:49.000Z',
      },
    ],
  };

  expect(recivied2).toEqual(expected2);
});

test('it should check that the filterEmptyFields is called', () => {
  toJsonFeed({ meta, items: [item] });

  expect(filterEmptyFields).toHaveBeenCalledTimes(2);
  expect(filterEmptyFields).toHaveBeenCalledWith(expect.any(Object));
});
