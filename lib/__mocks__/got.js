'use strict';

const { createReadStream } = require('fs');
const { join } = require('path');

const got = jest.genMockFromModule('got');

const stream = jest.fn(() =>
  createReadStream(join(__dirname, '../__fixtures__/feed.xml')),
);

got.stream = stream;

module.exports = got;
