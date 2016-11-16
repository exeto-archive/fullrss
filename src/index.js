import feedParse from './feedParse';
import generateFeed from './generateFeed';

export default async function (args) {
  const parsedFeed = await feedParse(args);
  return generateFeed(parsedFeed, args);
}
