'use strict';

const got            = require('got');
const FeedParser     = require('feedparser');
const iconv          = require('iconv-lite');
const getParams      = require('./get-params');

module.exports = function feedParse(args) {
  return new Promise(function (resolve, reject) {
    let count = 0;
    const max = args.max || 10;
    const result = { articles: [] };

    const feedparser = new FeedParser({ addmeta: false });

    got
      .stream(args.feed, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/45.0.2454.99 Safari/537.36',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,' +
            'image/webp,*/*;q=0.8',
          'accept-encoding': 'gzip, deflate, sdch',
          'accept-language': 'ru,en-US;q=0.8,en;q=0.6,it;q=0.4,fr;q=0.2,de;q=0.2',
        },
      })
      .on('error', function (error) {
        return reject(error);
      })
      .on('response', function (res) {
        if (res.statusCode !== 200) {
          return this.emit('error', new Error(res.statusCode + ' ' + res.statusMessage));
        }

        const charset = getParams(res.headers['content-type']).charset;

        if (charset && !/utf-*8/i.test(charset)) {
          this
            .pipe(iconv.decodeStream(charset))
            .pipe(iconv.encodeStream('utf-8'))
            .pipe(feedparser);
        } else {
          this.pipe(feedparser);
        }
      });

    feedparser
      .on('error', function (error) {
        return reject(error);
      })
      .on('meta', function (meta) {
        result.meta = meta;
      })
      .on('readable', function () {
        count++;

        if (count <= max) {
          result.articles.push(this.read());
        } else {
          this.emit('end');
        }
      })
      .on('end', function () {
        resolve(result);
      });
  });
};
