/* jshint node:true, unused:true */

var assert = require('assert');
var Q = require('q');
var Gitter = require('../lib/gitter.js');

var token = process.env.TOKEN;

if (!token) {
  console.log('========================================');
  console.log('You need to provide a valid OAuth token:');
  console.log('$ TOKEN=<your_token> USERNAME=<your_github_username> npm test');
  console.log('========================================\n');
  process.exit(1);
}

var yacht_room = '534bfb095e986b0712f0338e';

describe('Gitter Rooms', function() {
  this.timeout(20000);
  var gitter;

  before(function() {
    var opts = {};

    //var opts = {
    //  client: {
    //    host: "localhost",
    //    port: 5000,
    //    prefix: true,
    //    streamingEndpoint: 'http://localhost:5000/faye'
    //  }
    //};

    gitter = new Gitter(process.env.TOKEN, opts);
  });

  it('should find a room with cb', function(done) {
    gitter.rooms.find(yacht_room, function(err, room) {
      if (err) done(err);
      assert.equal(room.name, 'node-gitter/yacht');
      done();
    });
  });

  it('should find a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht');
    }).nodeify(done);
  });

  it('should be able to join a room', function(done) {
    gitter.rooms.join('node-gitter/yacht').then(function(room) {
      assert.equal(room.name, 'node-gitter/yacht');
    }).nodeify(done);
  });

  it('should be able to leave a room', function(done) {
    // Join the room first
    gitter.rooms.join('node-gitter/yacht').then(function(room) {
      return gitter.currentUser()
      .then(function(currentUser) {
        return room.removeUser(currentUser.id);
      });
    }).then(function() {
      return gitter.currentUser();
    }).then(function(user) {
      return user.rooms();
    }).then(function(rooms) {
      var check = rooms.some(function(room) { return room.name === 'node-gitter/yacht'; });
      assert.equal(false, check);
    }).fin(function() {
      // Join the room again for the rest of the tests
      gitter.rooms.join('node-gitter/yacht');
    }).nodeify(done);
  });

  it('should not be able to join an invalid room', function(done) {
    gitter.rooms.join('some-invalid-room').then(function() {
    }).fail(function(err) {
      assert(err);
      done();
    }).fail(done);
  });

  it('should be able to send a message', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.send('Time is ' + new Date());
    }).then(function(message) {
      assert(message);
    }).nodeify(done);
  });

  it('should be able to send a status message', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.sendStatus('Yo! checking time is ' + new Date());
    }).then(function(message) {
      assert(message.status);
    }).nodeify(done);
  });

  it('should fetch messages from a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.chatMessages({limit: 5});
    }).then(function(messages) {
      assert(messages.length === 5);
    }).nodeify(done);
  });

  it('should fetch users in a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.users();
    }).then(function(users) {
      assert(users.some(function(user) { return user.username === 'node-gitter'; }));
    }).nodeify(done);
  });

  it('should fetch channels in a room', function(done) {
    gitter.rooms.find(yacht_room).then(function(room) {
      return room.channels();
    }).then(function(channels) {
      assert(channels.some(function(channel) { return channel.name === 'node-gitter/yacht/pub'; }));
    }).nodeify(done);
  });

  it('should be able to listen on a room', function(done) {
    var msg = '[streaming] ' + new Date();

    gitter.rooms.find(yacht_room).then(function(room) {
      var events = room.listen();

      events.on('message', function(message) {
        if (message.text === msg) {
          done();
        }
      });

      setTimeout(function() { room.send(msg); }, 500);
    }).fail(done);
  });

  it('should be able to subscribe to a room', function(done) {
    var msg = '[faye] ' + new Date();

    gitter.rooms.find(yacht_room).then(function(room) {

      // Events snapshot
      //var eventz = room.streaming().events();
      //eventz.on('snapshot', function(snapshot) {
      //  assert(snapshot.length !== 0);
      //});

      var events = room.streaming().chatMessages();

      events.on('snapshot', function(snapshot) {
        assert(snapshot.length !== 0);
      });

      events.on('chatMessages', function(message) {
        if (message.model.text === msg) {
          room.streaming().disconnect();
          done();
        }
      });

      setTimeout(function() { room.send(msg); }, 750);
    }).fail(done);
  });


  it('should post to multiple rooms', function(done) {
    function postMessageInRoom(roomUri, message) {
      return gitter.rooms.join(roomUri)
        .then(function(room) {
          room.send(message);
          return room;
        })
        .delay(1000)
        .then(function(room) {
          return room.chatMessages({ limit: 2 });
        })
        .then(function(messages) {
          assert(messages.some(function(msg) {
            return msg.text === message;
          }), "Expecting to see posted message");
        });
    }

    Q.all([
        postMessageInRoom('node-gitter/yacht', 'yacht repo ping at ' + new Date()),
        postMessageInRoom('node-gitter/yacht/pub', 'yacht pub channel ping at ' + new Date()),
      ])
      .nodeify(done);
  });

});
