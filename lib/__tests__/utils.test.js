'use strict';

const got = require('got');
const he = require('he');

const {
  flatry,
  mercury,
  filterEmptyFields,
  mapP,
  createHash,
} = require('../utils');

jest.mock('got', () =>
  jest.fn(() =>
    Promise.resolve({ body: { excerpt: 'excerpt', content: 'content' } }),
  ),
);

jest.mock('he', () => ({ decode: jest.fn(x => x) }));

beforeEach(() => jest.clearAllMocks());

test('it should check flatry', () => {
  expect(flatry(Promise.resolve('data'))).resolves.toEqual([null, 'data']);
  expect(flatry('data')).resolves.toEqual([null, 'data']);
  expect(flatry(Promise.reject('err'))).resolves.toEqual(['err', null]);
});

test('it should check mercury', async () => {
  expect(await mercury('token', 'url')).toEqual({
    content: 'content',
    excerpt: 'excerpt',
  });

  got.mockImplementationOnce(() => Promise.reject('Error'));

  expect(await mercury('token', 'url')).toEqual({ content: '', excerpt: '' });
});

test('it should check call mercury dependencies with the correct arguments', async () => {
  await mercury('token', 'url');

  expect(got).toHaveBeenCalledTimes(1);

  expect(got).toHaveBeenCalledWith('https://mercury.postlight.com/parser', {
    json: true,
    query: { url: 'url' },
    headers: { 'x-api-key': 'token' },
  });

  expect(he.decode).toHaveBeenCalledTimes(2);
  expect(he.decode).toHaveBeenCalledWith('excerpt');
  expect(he.decode).toHaveBeenCalledWith('content');
});

test('it should check filterEmptyFields', () => {
  expect(
    filterEmptyFields({
      lorem: 'lorem',
      ipsum: new Date(0),
      dolor: null,
      sit: undefined,
    }),
  ).toEqual({ lorem: 'lorem', ipsum: new Date(0) });
});

test('it should check mapP', async () => {
  const arr = ['lorem', Promise.resolve('ipsum')];
  const received = await mapP(arr, item => Promise.resolve(item));

  expect(received).toEqual(['lorem', 'ipsum']);
});

test('it should check createHash', () => {
  expect(createHash('lorem')).toBe('d2e16e6ef52a45b7468f1da56bba1953');
  expect(createHash('ipsum')).toBe('e78f5438b48b39bcbdea61b73679449d');
  expect(createHash('lorem')).toBe('d2e16e6ef52a45b7468f1da56bba1953');
});
