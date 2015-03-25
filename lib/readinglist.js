'use strict';

// API: http://readinglist.readthedocs.org/en/latest/api/resource.html

var extend = require('lodash').extend;
var P = require('promise');
var request = require('request');

var utils = require('./utils');

/**
 * @constructor
 * Readinglist constructor.
 *
 * @param  {String} server   Base HREF for the Readinglist server. Example: 'https://readinglist.stage.mozaws.net/v1'.
 * @param  {Object} auth     Object containing a `username` and `password`, or a `bearer` token.
 * @param  {Boolean} verbose Set to `true` to dump response headers when making a request. Default: `false`.
 * @return {Object}          [description]
 */
var Readinglist = function (server, auth, verbose) {
  this._defaultArgs = {
    json: true,
    auth: auth
  };
  this._getJson = getJson.bind(this);
  this._serverBase = server;
  this._verbose = !!verbose || (process.env.VERBOSE && (process.env.VERBOSE === 'true'));
};


module.exports = Readinglist;


/**
 * Gets all articles.
 *
 * @param  {Object} args    [description]
 * @return {Promise|Object} [description]
 */
Readinglist.prototype.getArticles = function (args, callback) {
  return this._getJson('get', '/articles', {
    qs: args
  }, callback);
};


/**
 * Gets a specific article, by `id`.
 *
 * @param  {String} id       Article `id`, as a string.
 * @return {Promise|Object}  [description]
 */
Readinglist.prototype.getArticle = function (id, callback) {
  return this._getJson('get', '/articles/' + id, callback);
};


/**
 * Creates a new article with the specified `data`, where `data` must contain at
 * least the following parameters:
 * - `url`:String
 * - `title`:String
 * - `added_by`:String
 *
 * @param  {Object} data     [description]
 * @return {Promise|Object}  [description]
 */
Readinglist.prototype.postArticle = function (data, callback) {
  return this._getJson('post', '/articles', {
    body: data
  }, callback);
};


/**
 * Update an article.
 *
 * @param  {String} id       `id` of the article to update.
 * @param  {Object} data     Properties to update.
 * @return {Promise|Object}  [description]
 */
Readinglist.prototype.patchArticle = function (id, data, headers, callback) {
  headers = headers || {};
  return this._getJson('patch', '/articles/' + id, {
    body: data,
    headers: headers
  }, callback);
};


/**
 * Deletes a specific article, by `id`.
 *
 * @param  {String} id       [description]
 * @return {Promise|Object}  [description]
 */
Readinglist.prototype.deleteArticle = function (id, callback) {
  return this._getJson('delete', '/articles/' + id, callback);
};


/**
 * Deletes all articles.
 *
 * @return {Promise|Array}  [description]
 */
Readinglist.prototype.deleteArticles = function (callback) {
  return this._getJson('delete', '/articles', callback);
};


/**
 * Return the status of each service your application depends on.
 *
 * @return {Promise|Object} [description]
 */
Readinglist.prototype.heartbeat = function (callback) {
  return this._getJson('get', '/__heartbeat__', callback);
};


/**
 * Returns a promise which resolves to an Object describing the service.
 *
 * @return {Promise|Object} [description]
 */
Readinglist.prototype.home = function (callback) {
  return this._getJson('get', '/', callback);
};


/**
 * Loads the specified JSON server endpoint using the specified `method` and
 * optional arguments. This method returns a chainable Promise, or can be used
 * with Node.js styled callbacks by specifying an optional `callback` function.
 *
 * @param  {String}   method   HTTP method to use to load resource. For example:
 * "GET" or "POST" or "PUT", etc.
 * @param  {String}   endpoint Server endpoint to call. This will be prefixed by
 * the `server` specified in the `Readinglist` constructor function.
 * @param  {Object}   args     Optional arguments to send to server.
 * @param  {Function} callback Optional callback function to invoke if you don't
 * want to use the Promise-based API. Callback function should be the standard
 * `function (err, data) {...}` syntax.
 * @return {Promise|Function}  [description]
 */
function getJson(method, endpoint, args, callback) {
  // `args` is optional. If the `callback` function was specified as the third
  // arg, shift the callback function and default `args` to an empty object.
  if (typeof args === 'function') {
    callback = args;
    args = {};
  }
  // Invoke the `requestP` method, using the Readinglist object as the scope.
  // Also, if `callback` was specified de-promise this and use callback syntax
  // instead. :magic:
  return requestP.apply(this, [method, endpoint, args]).nodeify(callback);
}


/**
 * @private
 * Promise-ified version of the request module.
 *
 * @param  {String} method  [description]
 * @param  {String} uri     [description]
 * @param  {Object} args    [description]
 * @return {Promise/*}      [description]
 */
function requestP(method, uri, args) {
  var options = {
    method: method,
    uri: this._serverBase + uri
  };
  var serverArgs = extend(this._defaultArgs, options, args);
  var verbose = this._verbose;

  return new P(function (resolve, reject) {
    request(serverArgs, function (err, res, body) {
      // If we're in verbose mode, dump the request module options and the
      // response headers.
      if (verbose) {
        console.log('OPTIONS:\n%s\n---', utils.prettyjson(serverArgs));
        console.log('HEADERS:\n%s\n---', utils.prettyjson(res.headers));
      }
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  });
}
