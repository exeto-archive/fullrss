import fs from 'fs';
import test from 'ava';
import pify from 'pify';
import fullrss from '../';
import createServer from './_server';

const readFile = pify(fs.readFile);
let s;

test.before('setup', async () => {
  s = await createServer();
  await s.listen(s.port);
});

test('equal feed', async t => {
  let feed = await fullrss({
    feed: `${s.url}/beforeFeed.xml`,
    elements: '.test2, .test',
    dropElements: '.delete, h1',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeed.xml', 'utf-8'));
});

test('missing elements', async t => {
  let feed = await fullrss({
    feed: `${s.url}/beforeFeed.xml`,
    elements: '.missing',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMissing.xml', 'utf-8'));
});

test('missing token', async t => {
  try {
    await fullrss({
      feed: `${s.url}/beforeFeed.xml`,
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Missing token Readability');
  }
});

test('error 404', async t => {
  try {
    await fullrss({
      feed: `${s.url}/404`,
      elements: 'p',
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Response code 404 (Not Found)');
  }
});

test('not a feed', async t => {
  try {
    await fullrss({
      feed: `${s.url}/post/1.html`,
      elements: 'p',
    });

    t.fail('Exception was not thrown');
  } catch (err) {
    t.is(err.message, 'Not a feed');
  }
});

test('max items', async t => {
  let feed = await fullrss({
    feed: `${s.url}/beforeFeed.xml`,
    elements: '.test2, .test',
    dropElements: '.delete, h1',
    max: 2,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedMax.xml', 'utf-8'));
});

test('pure html', async t => {
  let feed = await fullrss({
    feed: `${s.url}/beforeFeed.xml`,
    elements: '.test2, .test',
    dropElements: '.delete, h1',
    pureHtml: true,
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedPure.xml', 'utf-8'));
});

test('encoding windws-1251', async t => {
  let feed = await fullrss({
    feed: `${s.url}/beforeFeedWindows1251.xml`,
    elements: 'p',
  });

  feed = feed.replace(/<lastBuildDate>.*/, '');

  t.is(feed, await readFile('fixtures/afterFeedWindows1251.xml', 'utf-8'));
});

test.after('cleanup', async () => {
  await s.close();
});
