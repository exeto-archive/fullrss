'use strict';

const got            = require('got');
const FeedParser     = require('feedparser');
const iconv          = require('iconv-lite');
const getParams      = require('./get-params');

module.exports = function feedParse(feed, maxItems) {
  return new Promise(function(resolve, reject) {
    let count = 0;
    let max = maxItems || 10;
    let result = { articles: [] };

    let feedparser = new FeedParser({ addmeta: false });

    got
      .stream(feed, {
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                        'Chrome/45.0.2454.99 Safari/537.36'
        }
      })
      .on('error', function(error) {
        return reject(error);
      })
      .on('response', function(res) {
        if (res.statusCode !== 200) {
          return this.emit('error', new Error(res.statusCode + ' ' + res.statusMessage));
        }

        let charset = getParams(res.headers['content-type']).charset;

        if (charset && !/utf-*8/i.test(charset)) {
          res
            .pipe(iconv.decodeStream(charset))
            .pipe(iconv.encodeStream('utf-8'))
            .pipe(feedparser);
        } else {
          res.pipe(feedparser);
        }
      });

    feedparser
      .on('error', function(error) {
        return reject(error);
      })
      .on('meta', function(meta) {
        result.meta = meta;
      })
      .on('readable', function() {
        count++;

        if (count <= max) {
          result.articles.push(this.read());
        } else {
          this.emit('end');
        }
      })
      .on('end', function() {
        resolve(result);
      });
  });
};
