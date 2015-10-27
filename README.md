# fullrss [![Dependency Status][depstat-image]][depstat-url]

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

[depstat-url]: https://gemnasium.com/exeto/fullrss
[depstat-image]: https://img.shields.io/gemnasium/exeto/fullrss.svg?style=flat
