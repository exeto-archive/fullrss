import got from 'got';
import FeedParser from 'feedparser';
import iconv from 'iconv-lite';

import { headers, getCharset } from './utils';

export default function ({ uri, max = 10 }) {
  return new Promise((resolve, reject) => {
    const result = { articles: [] };
    const feedParser = new FeedParser({ addmeta: false });
    let count = 0;

    got.stream(uri, { headers })
      .on('error', reject)
      .on('response', function (res) {
        const charset = getCharset(res.headers['content-type']);

        if (charset && !/utf-*8/i.test(charset)) {
          this
            .pipe(iconv.decodeStream(charset))
            .pipe(iconv.encodeStream('utf-8'))
            .pipe(feedParser);
        } else {
          this.pipe(feedParser);
        }
      });

    feedParser
      .on('error', reject)
      .on('meta', meta => (result.meta = meta))
      .on('readable', function () {
        count += 1;

        if (count <= max) {
          result.articles.push(this.read());
        } else {
          this.emit('end');
        }
      })
      .on('end', () => resolve(result));
  });
}
