'use strict';

var Code = require('code');
var Lab = require('lab');
var P = require('promise');

var Readinglist = require('../index');

var lab = Lab.script();
exports.lab = lab;

var beforeEach = lab.beforeEach;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

var READINGLIST_SERVER = process.env.READINGLIST_SERVER || 'https://readinglist.stage.mozaws.net/v1';

var rl = new Readinglist(READINGLIST_SERVER, {
  user: process.env.USER || '',
  pass: process.env.PASS || ''
});

function deleteAllArticles(done) {
  rl.deleteArticles().then(function () {
    done();
  }, done);
}

function randomUUID() {
  return Date.now() + Math.random();
}

function postRandomArticle(args) {
  var uuid = randomUUID();
  args = args || {};

  return rl.postArticle({
    url: args.url || 'http://localhost/' + uuid,
    title: args.title || 'Page ' + uuid,
    added_by: args.added_by || process.env.USER
  });
}

describe('Readinglist', {timeout: 5000}, function () {
  describe('#home()', function () {
    it('returns expected JSON', function (done) {
      rl.home().then(function (response) {
        var responseKeys = Object.keys(response);
        expect(responseKeys).to.only.include(['documentation', 'hello', 'url', 'version']);
        expect(response.documentation).to.equal('https://readinglist.readthedocs.org/');
        expect(response.hello).to.equal('readinglist');
        expect(READINGLIST_SERVER).to.startWith(response.url);
        expect(response.version).to.equal('1.2.0');
        done();
      }).catch(done);
    });
  });

  describe('#heartbeat()', function () {
    it('can successfully connect to database', function (done) {
      rl.heartbeat().then(function (response) {
        expect(response.database).to.be.true();
        done();
      }).catch(done);
    });
  });

  describe('#getArticle()', function () {
    beforeEach(deleteAllArticles);

    it('returns the specified article', function (done) {
      postRandomArticle().then(function (data) {
        return rl.getArticle(data.id).then(function (article) {
          expect(article.id).to.equal(data.id);
          done();
        });
      }).catch(done);
    });
  });

  describe('#getArticles()', function () {
    beforeEach(deleteAllArticles);

    it('returns all articles', function (done) {
      postRandomArticle().then(function () {
        return rl.getArticles().then(function (articles) {
          expect(articles.items.length).to.equal(1);
          done();
        });
      }).catch(done);
    });
  });

  describe('#postArticle()', function () {
    beforeEach(deleteAllArticles);

    it('returns the correct specified parameters', function (done) {
      var orig = {
        title: 'Hello world!',
        url: 'http://localhost/' + randomUUID(),
        added_by: process.env.USER
      };
      var keys = Object.keys(orig);
      rl.postArticle(orig).then(function (article) {
        // Make sure each key/value in `orig` matches the created article.
        keys.forEach(function (key) {
          expect(article[key]).to.equal(orig[key]);
        });
        done();
      }).catch(done);
    });
  });

  describe('#deleteArticle()', function () {
    beforeEach(deleteAllArticles);

    it('deletes a specific article', function (done) {
      var first = {
        title: 'Hello world 1'
      };
      var second = {
        title: 'Hello world 2'
      };
      // Add 2 random articles.
      P.all([
        postRandomArticle(first),
        postRandomArticle(second)
      ]).then(function (articles) {
        var article1_id = articles[0].id;
        // Make sure that both articles were added.
        expect(articles.length).to.equal(2);
        // Delete the first article.
        return rl.deleteArticle(article1_id).then(function (article) {
          var articleKeys = Object.keys(article);
          expect(articleKeys).to.only.include(['deleted', 'id', 'last_modified']);
          expect(article.deleted).to.be.true();
          expect(article.id).to.equal(article1_id);
          // Get all articles.
          return rl.getArticles().then(function (data) {
            var firstItem = data.items[0];
            // Make sure only 1 article exists, and it isn't the deleted article.
            expect(data.items.length).to.equal(1);
            expect(firstItem.title).to.equal(second.title);
            expect(firstItem.id).to.not.equal(article1_id);
            done();
          });
        });
      }).catch(done);
    });
  });

  describe('#deleteArticles()', function () {
    beforeEach(deleteAllArticles);

    it('deletes all articles', function (done) {
      // Create 2 random articles.
      P.all([
        postRandomArticle(),
        postRandomArticle()
      ]).then(function (data) {
        expect(data.length).to.equal(2);
        // Make sure that `getArticles()` returns our 2 items.
        return rl.getArticles().then(function (articles) {
          expect(articles.items.length).to.equal(2);
          // Delete all articles.
          return rl.deleteArticles().then(function (deletedArticles) {
            expect(deletedArticles.items.length).to.equal(2);
            // Make sure `getArticles()` returns 0 items.
            return rl.getArticles().then(function (articles2) {
              expect(articles2.items).to.be.empty();
              done();
            });
          });
        });
      }).catch(done);
    });
  });
});
