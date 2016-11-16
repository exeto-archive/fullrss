import Feed from 'rss';

import FullText from './FullText';

export default async function generateFeed(parsedFeed, args) {
  const fullText = new FullText(args);
  const feed = new Feed({
    title: parsedFeed.meta.title,
    site_url: parsedFeed.meta.link,
    language: parsedFeed.meta.language,
    pubDate: parsedFeed.meta.date,
  });
  let count = parsedFeed.articles.length;

  for (const i of parsedFeed.articles) {
    const body = await fullText.get(i.link);

    feed.item({
      title: i.title,
      description: body,
      url: i.link,
      author: i.author,
      date: i.date,
    });

    count -= 1;

    if (count === 0) {
      break;
    }
  }

  return feed.xml({ indent: '  ' });
}
