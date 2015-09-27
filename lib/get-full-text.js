'use strict';

const co          = require('co');
const cheerio     = require('cheerio');
const iconv       = require('iconv-lite');
const got         = require('got');
const readability = require('./readability');
const cleanHtml   = require('./clean-html');
const getParams   = require('./get-params');

module.exports = function(url, elements, dropElements, token, pureHtml) {
  return co(function*() {
    if (!elements) {
      return yield readability(url, token);
    }

    let res = yield got(url, {
      encoding: null,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) ' +
                      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/45.0.2454.99 Safari/537.36'
      }
    });

    let charset = getParams(res.headers['content-type']).charset;

    if (charset && !/utf-*8/i.test(charset)) {
      let str = iconv.decode(res.body, charset);
      res.body = iconv.encode(str, 'utf-8');
    }

    let $ = cheerio.load(res.body, {
      decodeEntities: false
    });

    let text = $(elements).map(function() {
      let $this = $(this).find(dropElements).remove().end();
      return $.html($this);
    }).get().join('\n');

    text = text || `[[ There is no such elements: ${elements} ]]`;

    if (pureHtml) {
      return yield cleanHtml(text);
    }

    return text;
  });
};
