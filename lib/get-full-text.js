'use strict';

const co          = require('co');
const cheerio     = require('cheerio');
const iconv       = require('iconv-lite');
const coRequest   = require('./co-request');
const readability = require('./readability');
const cleanHtml   = require('./clean-html');
const getParams   = require('./get-params');
const randomInt   = require('./random-int');

module.exports = function(url, elements, dropElements, token) {
  return co(function*() {
    if (!elements) {
      return yield readability(url, token);
    }

    let res = yield coRequest({
      url: url,
      headers: {
        'Accept': 'text/xml,application/xml,application/xhtml+xml,' +
                  'text/html;q=0.9,text/plain;q=0.8,image/png,' +
                  '*/*;q=0.' + randomInt(2, 5),
        'Accept-Language': 'en-us,en;q=0.' + randomInt(5, 9),
        'Accept-Charset': 'utf-8,windows-1251;q=0.7,*;q=0.' + randomInt(5, 7),
        'Keep-Alive': '300',
        'Expect': ''
      },
      encoding: null,
      gzip: true
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
      return $(this).find(dropElements).remove().end().html();
    }).get().join('\n');

    text = text || `[[ There is no such elements: ${elements} ]]`;

    return yield cleanHtml(text);
  });
};
