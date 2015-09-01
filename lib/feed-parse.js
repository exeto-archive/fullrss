'use strict';

const request        = require('request');
const FeedParser     = require('feedparser');
const iconv          = require('iconv-lite');
const getParams      = require('./get-params');
const randomInt      = require('./random-int');

module.exports = function feedParse(feed, maxItems) {
  return new Promise(function(resolve, reject) {
    let count = 0;
    let max = maxItems || 10;
    let result = { articles: [] };

    let options = {
      url: feed,
      headers: {
        'Accept': 'text/xml,application/xml,application/xhtml+xml,' +
                  'text/html;q=0.9,text/plain;q=0.8,image/png,' +
                  '*/*;q=0.' + randomInt(2, 5),
        'Accept-Language': 'en-us,en;q=0.' + randomInt(5, 9),
        'Accept-Charset': 'utf-8,windows-1251;q=0.7,*;q=0.' + randomInt(5, 7),
        'Keep-Alive': '300',
        'Expect': ''
      },
      encoding: null
    };

    let feedparser = new FeedParser({ addmeta: false });

    request
      .get(options)
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
