/* jshint node:true, unused:true */

var assert = require('assert');
var Gitter = require('../lib/gitter.js');

var token = process.env.TOKEN;
var username = process.env.USERNAME || 'node-gitter';

if (!token) {
  console.log('========================================');
  console.log('You need to provide a valid OAuth token:');
  console.log('$ TOKEN=<your_token> USERNAME=<your_github_username> npm test');
  console.log('========================================\n');
  process.exit(1);
}

describe('Gitter Users', function() {
  this.timeout(5000);

  var gitter;

  before(function() {
    gitter = new Gitter(process.env.TOKEN);
  });

  it('should fetch the current user cb', function(done) {
    gitter.currentUser(function(err, user) {
      if (err) done(err);
      assert.equal(user.username, username);
      done();
    });
  });

  it('should fetch the current user', function(done) {
    gitter.currentUser().then(function(user) {
      assert.equal(user.username, username);
    }).nodeify(done);
  });

  it('should fetch the user rooms', function(done) {
    gitter.currentUser().then(function(user) {
      return user.rooms();
    }).then(function(rooms) {
      assert(rooms.length !== 0);
    }).nodeify(done);
  });

  it('should fetch the user repos', function(done) {
    gitter.currentUser().then(function(user) {
      return user.repos();
    }).then(function(repos) {
      assert(repos.length !== 0);
    }).nodeify(done);
  });

  it('should fetch the user orgs', function(done) {
    gitter.currentUser().then(function(user) {
      return user.orgs();
    }).then(function(orgs) {
      assert(orgs.length !== 0);
    }).nodeify(done);
  });

  it('should fetch the user channels', function(done) {
    gitter.currentUser().then(function(user) {
      return user.channels();
    }).then(function(channels) {
      assert(channels.length !== 0);
    }).nodeify(done);
  });

  it('should fail when fidning an invalid user', function(done) {
    gitter.users.find('invalid').then(function() {
      assert(false);
    }).fail(function() {
      done();
    });
  });

  it('should fail when fidning an invalid user with cb', function(done) {
    gitter.users.find('invalid', function(err, user) {
      assert.equal(user, null);
      assert(err);
      done();
    });
  });

});
