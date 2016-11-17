import fs from 'fs';
import path from 'path';
import test from 'ava';
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

test.before('setup', async () => {
  nock('https://mercury.postlight.com')
    .filteringPath(/\?url=[^&]*/g, '')
    .get('/parser')
    .times(6)
    .reply(200, { content: 'content' });

  s = await createServer();
  await s.listen(s.port);
});

test('equal feed', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeed.xml', 'utf-8'));
});

test('missing elements', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMissing.xml', 'utf-8'));
});

test('missing token', async (t) => {
  try {
    await fullrss({
      uri: `${s.url}/beforeFeed.xml`,
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Missing Mercury token');
  }
});

test('error 404', async (t) => {
  try {
    await fullrss({
      uri: `${s.url}/404`,
      target: 'p',
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Response code 404 (Not Found)');
  }
});

test('not a feed', async (t) => {
  try {
    await fullrss({
      uri: `${s.url}/post/1.html`,
      target: 'p',
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Not a feed');
  }
});

test('max items', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
    max: 2,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMax.xml', 'utf-8'));
});

test('pure html', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.test2, .test',
    exclude: '.delete, h1',
    pureHtml: true,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedPure.xml', 'utf-8'));
});

test('encoding windws-1251', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeedWindows1251.xml`,
    target: 'p',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedWindows1251.xml', 'utf-8'));
});

test('mercury', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMercury.xml', 'utf-8'));
});

test('use a mercury absent elements', async (t) => {
  let feed = await fullrss({
    uri: `${s.url}/beforeFeed.xml`,
    target: '.missing',
    mercuryToken: 'token',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMercury.xml', 'utf-8'));
});

test.after('cleanup', async () => {
  await s.close();
});
