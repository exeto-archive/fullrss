'use strict';

module.exports.headers = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'accept-encoding': 'gzip, deflate, sdch',
  'accept-language': 'ru,en-US;q=0.8,en;q=0.6,it;q=0.4,fr;q=0.2,de;q=0.2',
};

module.exports.getCharset = (str = '') => {
  return str.split(';').reduce((result, item) => {
    if (/charset/.test(item)) {
      return (result = item.split('=')[1].trim());
    }
    return result;
  }, null);
};
