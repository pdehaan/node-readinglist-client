'use strict';

var Readinglist = require('./lib/readinglist');
var utils = require('./lib/utils');

var USER_PASS_AUTH = {
  user: process.env.USER,
  pass: process.env.PASS || ''
};
var BEARER_TOKEN_AUTH = {
  bearer: process.env.TOKEN || ''
};


var rl = new Readinglist('https://readinglist.stage.mozaws.net/v1', USER_PASS_AUTH);

/* Get all articles (as promise): */
rl.getArticles({
  _limit: 3
}).then(prettyJson).catch(console.error);


/* Get all articles (as callback): */
rl.getArticles({
  _limit: 3
}, function (err, data) {
  if (err) {
    return console.error(err);
  }
  prettyJson(data);
});


/* Get specific article by `id`: */
// rl.getArticle('a690028a-93df-4850-b84b-d6c9649a9fee').then(prettyJson).catch(console.error);


/* Delete specific article by `id`: */
// rl.deleteArticle('a690028a-93df-4850-b84b-d6c9649a9fee').then(prettyJson).catch(console.error);


/* Delete all articles: */
// rl.deleteArticles().then(prettyJson).catch(console.error);


/* Update an existing article. */
// rl.patchArticle('ed4b0d63-8328-43e9-b591-30abf593577b', {
//   favorite: true,
//   read_position: 22,
//   archived: true
// }, {
//   'Response-Behavior': 'light'
// }).then(prettyJson).catch(console.error);


/* Create new article. */
// rl.postArticle({
//   url: 'http://reddit.com/r/reactiongifs' + i,
//   title: 'Reddit /r/reactiongifs' + i,
//   added_by: process.env.USER,
//   unread: false
// }).then(prettyJson).catch(console.error);


/* Check the server heartbeat. */
// rl.heartbeat().then(prettyJson).catch(console.error);

function prettyJson(data) {
  return console.log(utils.stringify(data));
}
