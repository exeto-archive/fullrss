/* eslint strict: 0 */

'use strict';

const fs = require('fs');
const http = require('http');
const pify = require('pify');

module.exports = function () {
  const s = http.createServer((req, res) => {
    fs.readFile(`${__dirname}/fixtures${req.url}`, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }

      if (
        req.url === '/beforeFeedWindows1251.xml' ||
        req.url === '/post/windows1251.html'
      ) {
        res.setHeader('Content-Type', 'text/html; charset=windows-1251');
      }

      res.writeHead(200);
      res.end(data);
    });
  });

  s.port = 3000;
  s.url = `http://localhost:${s.port}`;

  s.listen = pify(s.listen);
  s.close = pify(s.close);

  return s;
};
