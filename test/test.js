import fs from 'fs';
import path from 'path';
import pify from 'pify';
import nock from 'nock';
import fullrss from '../src';
import createServer from './_server';

const readFile = async (filePath) => {
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

  expect(await readFile('fixtures/afterFeed.xml', 'utf-8')).toBe(feed);
});

test('missing elements', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(await readFile('fixtures/afterFeedMissing.xml', 'utf-8')).toBe(feed);
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

  expect(await readFile('fixtures/afterFeedMax.xml', 'utf-8')).toBe(feed);
});

test('pure html', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
    pureHtml: true,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(await readFile('fixtures/afterFeedPure.xml', 'utf-8')).toBe(feed);
});

test('encoding windws-1251', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeedWindows1251.xml`,
    target: 'p',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(await readFile('fixtures/afterFeedWindows1251.xml', 'utf-8')).toBe(feed);
});

test('mercury', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(await readFile('fixtures/afterFeedMercury.xml', 'utf-8')).toBe(feed);
});

test('use a mercury absent elements', async () => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  expect(await readFile('fixtures/afterFeedMercury.xml', 'utf-8')).toBe(feed);
});

afterAll(async () => {
  await s.close();
});
