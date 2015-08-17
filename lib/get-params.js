'use strict';

module.exports = function getParams(str) {
  if (!str) { return {}; }

  let result = str.split(';').reduce(function(params, param) {
    let parts = param.split('=').map(function(part) { return part.trim(); });

    if (parts.length === 2) {
      params[parts[0]] = parts[1];
    }

    return params;
  }, {});

  return result;
};
