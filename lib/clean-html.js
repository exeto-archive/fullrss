'use strict';

const sanitizeHtml = require('sanitize-html');

module.exports = function(str) {
  return sanitizeHtml(str, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'img',
      'figure',
      'figcaption',
      's',
      'strike',
      'code',
      'hr',
      'br',
      'table',
      'thead',
      'caption',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'u',
      'iframe',
    ],
    allowedAttributes: {
      a: ['href'],
      img: ['src'],
      iframe: ['src', 'width', 'height'],
    },
  });
};
