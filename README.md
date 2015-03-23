# node-readinglist-client

A Node.js client for mozilla/readinglist

## Installation:
This module isn't in npm, but you can install it directly from GitHub as **pdehaan/node-readinglist-client**:
```sh
$ npm i pdehaan/node-readinglist-client -S
```

## Usage:
```js
var Readinglist = require('node-readinglist-client');

var USER_PASS_AUTH = {
  user: process.env.USER,
  pass: process.env.PASS || ''
};

var rl = new Readinglist('https://readinglist.stage.mozaws.net/v1', USER_PASS_AUTH);

/* Get all articles (as promise): */
rl.getArticles({
  _limit: 3
}).then(console.log).catch(console.error);
```

If you want to use a callback syntax instead of the [superior] promise syntax, simply pass a callback function as the last argument with the standard `fn(err, data) {}` method signature:
```js
/* Get all articles (as callback): */
rl.getArticles({
  _limit: 3
}, function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log(data);
});
```

If you want to see verbose output, you can set `VERBOSE` mode by setting `VERBOSE=true` via the command line:
```sh
$ VERBOSE=true node index
```

Or you can specify verbose mode by specifying the optional third argument to the `Readinglist()` constructor:
```js
var rl = new Readinglist('https://readinglist.stage.mozaws.net/v1', USER_PASS_AUTH, true);
```
