'use strict';

module.exports = function getParams(str) {
  if (!str) { return {}; }

  const result = str.split(';').reduce((params, param) => {
    const parts = param.split('=').map(part => part.trim());

    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }

    return params;
  }, {});

  return result;
};
