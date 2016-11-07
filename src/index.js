import feedParse from './feedParse';
import generateFeed from './generateFeed';

export default function fullrss(args) {
  return feedParse(args)
    .then(result => generateFeed(result, args));
}
