'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const nock = require('nock');

const fullrss = require('../lib');
const createServer = require('./_server');

const readFile = async filePath => {
  filePath = path.join(__dirname, filePath);
  const file = await pify(fs.readFile)(filePath);

  return file.toString();
};

let s;

beforeAll(async () => {
  nock('https://mercury.postlight.com')
    .filteringPath(/\?url=[^&]*/g, '')
    .get('/parser')
    .times(6)
    .reply(200, { content: 'content' });

  s = await createServer();
  await s.listen(s.port);
});

test('equal feed', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeed.xml', 'utf-8'));
});

test('missing elements', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeedMissing.xml', 'utf-8'));
});

test('missing token', async () => {
  try {
    await fullrss({
      uri: `${s.url}/beforeFeed.xml`,
    });
  } catch (err) {
    expect(err.message).toBe('Missing Mercury token');
  }
});

test('error 404', async () => {
  try {
    await fullrss({
      uri: `${s.url}/404`,
      target: 'p',
    });
  } catch (err) {
    expect(err.message).toBe('Response code 404 (Not Found)');
  }
});

test('not a feed', async () => {
  try {
    await fullrss({
      uri: `${s.url}/post/1.html`,
      target: 'p',
    });
  } catch (err) {
    expect(err.message).toBe('Not a feed');
  }
});

test('max items', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
    max: 2,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeedMax.xml', 'utf-8'));
});

test('pure html', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
    pureHtml: true,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeedPure.xml', 'utf-8'));
});

test('encoding windws-1251', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeedWindows1251.xml`,
    target: 'p',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(
    await readFile('fixtures/afterFeedWindows1251.xml', 'utf-8'),
  );
});

test('mercury', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeedMercury.xml', 'utf-8'));
});

test('use a mercury absent elements', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(feed).toBe(await readFile('fixtures/afterFeedMercury.xml', 'utf-8'));
});

afterAll(async () => {
  await s.close();
});
