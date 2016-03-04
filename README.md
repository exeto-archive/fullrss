# fullrss
[![NPM Version][version-image]][version-url] [![Build Status][buildstat-image]][buildstat-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependency Status][depstat-image]][depstat-url]

Generator full rss feed.

## Install

```
$ npm install --save fullrss
```

## Usage

```js
const fullrss = require('fullrss');

fullrss({
  feed: 'http://domain.com/feed',
  elements: '.post-img, .post',
  dropElements: '.counter, .ad',
  max: 5,
  token: 'readability token'
})
  .then(console.log)
  .catch(console.error);
```

## API

### fullrss(options)

#### options

##### feed

Type: `string`  
Default: `false`

Address feed

##### elements

Type: `string`  
Default: `false`

The choice of the elements of the article. If you do not specify, the receipt of the full text will be made via Readability. Parsing rules, see [cheerio](https://github.com/cheeriojs/cheerio). If you specify the token and the item is not found, it will use readability to get the full text.

##### dropElements

Type: `string`  
Default: `false`

To exclude the elements. Parsing rules, see [cheerio](https://github.com/cheeriojs/cheerio).

##### max

Type: `number`  
Default: `10`

The maximum number of feed items.

##### token

Type: `string`  
Default: `false`

Token to obtain the full text via Readability.

##### pureHtml

Type: `boolean`  
Default: `false`

Cleaning of unnecessary tags and attributes.

## License

[MIT](LICENSE.md) © [Timofey Dergachev](http://exeto.me/)

[version-url]: https://www.npmjs.com/package/fullrss
[version-image]: https://img.shields.io/npm/v/fullrss.svg?style=flat-square
[buildstat-url]: https://travis-ci.org/exeto/fullrss?branch=master
[buildstat-image]: https://img.shields.io/travis/exeto/fullrss/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/exeto/fullrss?branch=master
[coverage-image]: https://img.shields.io/coveralls/exeto/fullrss/master.svg?style=flat-square
[depstat-url]: https://david-dm.org/exeto/fullrss#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/fullrss.svg?style=flat-square
