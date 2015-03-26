# node-readinglist-client

A Node.js client for mozilla/readinglist

## Installation:
This module isn't in npm, but you can install it directly from GitHub as **pdehaan/node-readinglist-client**:
```sh
$ npm i pdehaan/node-readinglist-client -S
```

## Usage (basic auth):
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

## Usage (OAuth):

```js
'use strict';

/*
var STAGE = {
  URL: 'https://readinglist.stage.mozaws.net/v1',
  AUTH: {
    user: process.env.USER,
    pass: process.env.PASS || ''
  }
};
*/

var PROD = {
  URL: 'https://readinglist.services.mozilla.com/v1',
  AUTH: {
    bearer: 'x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0x0'
  }
};

var Readinglist = require('node-readinglist-client');
var utils = require('node-readinglist-client/lib/utils');

var rl = new Readinglist(PROD.URL, PROD.AUTH);
rl.getArticles({
  _limit: 1
}).then(function (data) {
  console.log('articles:\n%s\n', utils.stringify(data));

  console.log('headers:\n%s\n', utils.prettyjson(data._headers));
  console.log('status code: %d\n', data._statusCode);
}).catch(console.log);
```

Running the previous code example should give you the following output:
```
articles:
{
  "items": [
    {
      "added_by": "pdehaan",
      "added_on": 1427354752560,
      "archived": false,
      "excerpt": "",
      "favorite": false,
      "id": "c92be1d6-67a7-4f7b-b441-e88d833ad98e",
      "is_article": true,
      "last_modified": 1427354752583,
      "marked_read_by": null,
      "marked_read_on": null,
      "preview": null,
      "read_position": 0,
      "resolved_title": "Mozilla -- homepage",
      "resolved_url": "https://mozilla.com/",
      "stored_on": 1427354752560,
      "title": "Mozilla -- homepage",
      "unread": true,
      "url": "https://mozilla.com/",
      "word_count": null
    }
  ]
}

headers:
  access-control-expose-headers:    Backoff, Retry-After, Alert, Next-Page, Total-Records, Last-Modified
  content-length:                   475
  connection:                       keep-alive
  last-modified:                    1427354752583
  access-control-allow-methods:     GET, POST, OPTIONS
  backoff:                          None
  total-records:                    1
  access-control-allow-credentials: true
  content-type:                     application/json; charset=UTF-8
  access-control-allow-headers:     DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,X-Conditions-Accepted
  access-control-max-age:           1728000
  date:                             Thu, 26 Mar 2015 21:36:19 GMT

status code: 200
```

As you can see, there are two 'hidden' properties returned in the server response: `_headers` and `_statusCode`. The `_headers` object is an array of response headers returned by the server, and `_statusCode` is the HTTP status code returned by the server request.


## Generating OAuth Bearer tokens:

You can generate a stage or production OAuth bearer token by cloning the [**mozilla/fxa-oauth-client**](https://github.com/mozilla/fxa-oauth-client/) repository and running the included [./bin/fxa-oauth.js](https://github.com/mozilla/fxa-oauth-client/blob/master/bin/fxa-oauth.js) script from the command line:

```sh
$ node bin/fxa-oauth.js token 5882386c6d801776 readinglist -u {{email}} --env prod
fxa info env prod
fxa info user {{email}}
Password: <prompt>
fxa http POST https://api.accounts.firefox.com/v1/account/login
fxa http 200 https://api.accounts.firefox.com/v1/account/login
fxa http POST https://api.accounts.firefox.com/v1/certificate/sign
fxa http 200 https://api.accounts.firefox.com/v1/certificate/sign
fxa http POST https://oauth.accounts.firefox.com/v1/authorization
fxa http 200 https://oauth.accounts.firefox.com/v1/authorization
token: {{token}}
fxa info ok
```

To generate a bearer token for the [stage server](https://readinglist.stage.mozaws.net/v1/), specify the `--env` as 'stage'.
