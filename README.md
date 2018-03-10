# fullrss

![Node Version][node-image] [![Build Status][buildstat-image]][buildstat-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url]

Generator full rss feed.

## Install

```
$ npm install --save fullrss
```

## Usage

```js
const fullrss = require('fullrss');

(async () => {
  const feed = await fullrss({
    url: 'http://domain.com/feed',
    token: 'token',
    max: 5,
  });

  // ...
})();
```

## API

### fullrss(options)

#### options

##### url

Type: `string`

Address feed

##### token

Type: `string`

Token to obtain the full text via [Mercury](https://mercury.postlight.com/web-parser/).

##### max

Type: `number`  
Default: `0`

The maximum number of feed items. If `0` is specified, all items will be processed.

##### cache

Type: `object`  
Default: `{ get(key) {}, set(key, value) {} }`

To avoid unnecessary queries to `mercury`, you can use the cache. Methods can return a promise. The `key` is calculated based on the modified date and id. For example:

```js
const store = require('...');

class Cache {
  get(key) {
    return store.get(key);
  }

  set(key, value) {
    store.set(key, value);
  }
}
```

## License

[MIT](LICENSE.md) © [Timofey Dergachev](https://exeto.me/)

[node-image]: https://img.shields.io/badge/node-v8.x.x-brightgreen.svg?style=flat-square
[buildstat-url]: https://travis-ci.org/exeto/fullrss?branch=master
[buildstat-image]: https://img.shields.io/travis/exeto/fullrss/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/exeto/fullrss?branch=master
[coverage-image]: https://img.shields.io/coveralls/exeto/fullrss/master.svg?style=flat-square
[depstat-url]: https://david-dm.org/exeto/fullrss#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/fullrss.svg?style=flat-square
