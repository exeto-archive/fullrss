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

fullrss({
  uri: 'http://domain.com/feed',
  target: '.post-img, .post',
  exclude: '.counter, .ad',
  max: 5,
  mercuryToken: 'token'
})
  .then(feed => console.log(feed));
```

## API

### fullrss(options)

#### options

##### uri

Type: `string`  
Default: `false`

Address feed

##### target

Type: `string`  

The choice of the elements of the article. Parsing rules, see [cheerio](https://github.com/cheeriojs/cheerio). If you specify the `mercuryToken` and the elements is not found, it will use [Mercury](https://mercury.postlight.com/web-parser/) to get the full text.

##### exclude

Type: `string`  

To exclude the elements. Parsing rules, see [cheerio](https://github.com/cheeriojs/cheerio).

##### max

Type: `number`  
Default: `10`

The maximum number of feed items.

##### mercuryToken

Type: `string`  

Token to obtain the full text via [Mercury](https://mercury.postlight.com/web-parser/). Used if not specified `target`.

##### pureHtml

Type: `boolean`  
Default: `false`

Cleaning of unnecessary tags and attributes.

## License

[MIT](LICENSE.md) © [Timofey Dergachev](https://exeto.me/)

[node-image]: https://img.shields.io/badge/node-v8.x.x-brightgreen.svg?style=flat-square
[buildstat-url]: https://travis-ci.org/exeto/fullrss?branch=master
[buildstat-image]: https://img.shields.io/travis/exeto/fullrss/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/exeto/fullrss?branch=master
[coverage-image]: https://img.shields.io/coveralls/exeto/fullrss/master.svg?style=flat-square
[depstat-url]: https://david-dm.org/exeto/fullrss#info=Dependencies
[depstat-image]: https://img.shields.io/david/exeto/fullrss.svg?style=flat-square
