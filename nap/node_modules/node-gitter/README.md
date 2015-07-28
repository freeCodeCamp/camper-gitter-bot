# node-gitter [![Gitter chat](https://badges.gitter.im/gitterhq/node-gitter.png)](https://gitter.im/gitterhq/node-gitter)

Node.js client for the [Gitter](https://gitter.im) API. For more info visit: [Gitter Developers website](https://developer.gitter.im).

If you have any questions, click on the badge to join the conversation.

## Installation
```
$ npm install --save node-gitter
```

## Basics

```js
var Gitter = require('node-gitter');

var gitter = new Gitter(token);

gitter.currentUser()
.then(function(user) {
  console.log('You are logged in as:', user.username);
});
```

### Authentication

It's mandatory to provide a valid Gitter OAuth token in order to use the client. You can obtain one from [https://developer.gitter.im/apps](https://developer.gitter.im/apps).

### Promises or Callbacks

The client implements both. The following code is equivalent:

Using promises:

```js
gitter.rooms.join('gitterhq/sandbox')
.then(function(room) {
  console.log('Joined room: ', room.name);
})
.fail(function(err) {
  console.log('Not possible to join the room: ', err);
})
```

Using node-style callbacks:

```js
gitter.rooms.join('gitterhq/sandbox', function(err, room) {
  if (err) {
    console.log('Not possible to join the room: ', err);
    return;
  }

  console.log('Joined room: ', room.name);
});

```

## Users

### Current user
```js
gitter.currentUser()
```

### Current user rooms, repos, orgs and channels
```js
gitter.currentUser()
.then(function(user) {
  user.rooms()
  user.repos()
  user.orgs()
  user.channels()
})
```

### Find a user
```js
gitter.users.find(userId)
```

## Rooms

### Join a room
```js
gitter.rooms.join('gitterhq/sandbox')
```

### Post a message to a room
```js
gitter.rooms.join('gitterhq/sandbox')
.then(function(room) {
  room.send('Hello world!');
});

```

### Listen for chatMessages, Events or Users in a room
```js
gitter.rooms.find(roomId).then(function(room) {

  var events = room.streaming().chatMessages();

  // The 'snapshot' event is emitted once, with the last messages in the room
  events.on('snapshot', function(snapshot) {
    console.log(snapshot.length + ' messages in the snapshot');
  });

  // The 'chatMessages' event is emitted on each new message
  events.on('chatMessages', function(message) {
    console.log('A message was ' + message.operation);
    console.log('Text: ', message.model.text);
  });
});
```


### Listen for messages in a room
```js
gitter.rooms.join('gitterhq/sandbox').then(function(room) {
  var events = room.listen();

  events.on('message', function(message) {
    console.log('New message:', message.text);
  });
});
```

### Room users, channels and messages
```js
gitter.rooms.find(roomId)
.then(function(room) {
  room.users()
  room.channels()
  room.chatMessages()
});
```

### Leave a room
```js
gitter.rooms.find(roomId)
.then(function(room) {
  room.leave()
});
```

# License

BSD
