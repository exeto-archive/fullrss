'use strict';

module.exports = function(min, max) {
  let rand = min + Math.random() * (max - min);
  rand = Math.round(rand);
  return rand;
};
