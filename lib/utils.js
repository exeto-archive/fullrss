'use strict';

const crypto = require('crypto');
const got = require('got');
const he = require('he');

const flatry = async promise => {
  try {
    return [null, await promise];
  } catch (err) {
    return [err, null];
  }
};

const mercury = async (token, url) => {
  const [err, res] = await flatry(
    got('https://mercury.postlight.com/parser', {
      json: true,
      query: { url },
      headers: { 'x-api-key': token },
    }),
  );

  const { excerpt, content } = err ? {} : res.body;

  return {
    excerpt: he.decode(excerpt || ''),
    content: he.decode(content || ''),
  };
};

const filterEmptyFields = obj =>
  Object.entries(obj).reduce((result, [key, value]) => {
    if (value) {
      result[key] = value;
    }

    return result;
  }, {});

const forEachP = async (arr, fn) => {
  for (const item of arr) {
    await fn(await item);
  }
};

const createHash = data =>
  crypto
    .createHash('md5')
    .update(data)
    .digest('hex');

module.exports = { mercury, filterEmptyFields, forEachP, createHash };
