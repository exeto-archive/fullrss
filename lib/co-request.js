'use strict';

const request = require('request');

module.exports = function coRequest(args) {
  return new Promise(function(resolve, reject) {
    request(args, function(error, res, body) {
      if (error) {
        return reject(error);
      } else if (res.statusCode !== 200) {
        return reject(new Error(res.statusCode + ' ' + res.statusMessage));
      }

      res.body = body;
      resolve(res);
    });
  });
};
