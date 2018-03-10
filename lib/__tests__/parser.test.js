'use strict';

const got = require('got');

const parser = require('../parser');
const headers = require('../headers');

beforeEach(() => got.stream.mockClear());

test('it should check the max argument', async () => {
  const data1 = await parser('url');

  expect(data1.items.length).toBe(3);

  const data2 = await parser('url', 1);

  expect(data2.items.length).toBe(1);
});

test('it should check the parsed fields', async () => {
  const { meta, items } = await parser('url');

  expect(meta.title).toBe('fullrss');
  expect(meta.link).toBe('http://domain.com/');
  expect(meta.xmlurl).toBe('http://domain.com/feed');
  expect(meta.description).toBe('Description');
  expect(meta.author).toBe(null);

  expect(items[0].guid).toBe('52384bd2-c094-4d48-98ac-4471b835980a');
  expect(items[0].link).toBe('http://domain.com/post/1.html');
  expect(items[0].title).toBe(
    'Ius et delenit tincidunt expetendis, utamur deterruisset nam te est.',
  );
  expect(items[0].pubdate).toEqual(new Date('2015-12-13T08:50:49.000Z'));
  expect(items[0].date).toEqual(new Date('2015-12-13T08:50:49.000Z'));
  expect(items[0].author).toBe('John Smith');
});

test('it checks the passed arguments in got.stream', async () => {
  await parser('url');

  expect(got.stream).toHaveBeenCalledTimes(1);
  expect(got.stream).toHaveBeenCalledWith('url', { headers });
});
