'use strict';

const fullrss = require('../');
const parser = require('../parser');
const toJsonFeed = require('../to-json-feed');
const addFullText = require('../add-full-text');

jest.mock('../parser', () => jest.fn(() => Promise.resolve('data')));
jest.mock('../to-json-feed', () => jest.fn(() => 'feed'));
jest.mock('../add-full-text', () => jest.fn(() => Promise.resolve('result')));

beforeEach(() => jest.clearAllMocks());

test('it should throw error when no url and token', () => {
  expect(fullrss({})).rejects.toThrow('url is a required field');

  expect(fullrss({ token: 'token' })).rejects.toThrow(
    'url is a required field',
  );

  expect(fullrss({ url: 'url' })).rejects.toThrow('token is a required field');
});

test('it should check call dependencies with the correct arguments', async () => {
  const result = await fullrss({
    url: 'url',
    token: 'token',
    max: 40,
    cache: 'cache',
  });

  expect(result).toBe('result');

  expect(parser).toHaveBeenCalledTimes(1);
  expect(toJsonFeed).toHaveBeenCalledTimes(1);
  expect(addFullText).toHaveBeenCalledTimes(1);

  expect(parser).toHaveBeenCalledWith('url', 40);
  expect(toJsonFeed).toHaveBeenCalledWith('data');
  expect(addFullText).toHaveBeenCalledWith({
    cache: 'cache',
    feed: 'feed',
    token: 'token',
  });
});
