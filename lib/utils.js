'use strict';

var INDENT = 2;

var cjson = require('canonical-json');
var pjson = require('prettyjson');


/**
 * Converts a JSON object into a formatted string with sorted keys.
 *
 * @param  {Object} data [description]
 * @return {String}      [description]
 */
exports.stringify = function (data) {
  return cjson(data, null, INDENT);
};

/**
 * Formats a JSON object as a readable string.
 *
 * @param  {Object} data [description]
 * @return {String}      [description]
 */
exports.prettyjson = function (data) {
  data = JSON.parse(exports.stringify(data));
  return pjson.render(data, {}, INDENT);
};
