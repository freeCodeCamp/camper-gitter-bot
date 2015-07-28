/* jshint node:true, unused:true */

var User = function(attrs, client, faye) {
  // API path to Users 
  this.path = '/user';

  if (attrs)
    Object.keys(attrs).forEach(function(k) {
      this[k] = attrs[k];
    }.bind(this));

  this.client = client;
  this.faye   = faye;
};

User.prototype.current = function() {
  return this.client.get(this.path)
  .then(function(users) {
    var userData = users[0];
    return new User(userData, this.client, this.faye);
  }.bind(this));
};

User.prototype.find = function(id, cb) {
  var path = this.path + '/' + id;
  return cb ? this.client.get(path).nodeify(cb) : this.client.get(path);
};

User.prototype.findById = function(id, cb) {
  var path = this.path + '/' + id;
  var user = this.client.get(path)
    .then(function(userData) {
      return new User(userData, this.client, this.faye);
    }.bind(this));
  
  return cb ? user.nodeify(cb) : user;
};

User.prototype.findByUsername = function(username, cb) {
  var user = this.client.get(this.path, {query: {q: username}})
    .then(function(results) {
      var userData = results.results[0];
      return new User(userData, this.client, this.faye);
    }.bind(this));
  
  return cb ? user.nodeify(cb) : user;
};

['rooms', 'repos', 'orgs', 'channels'].forEach(function(resource) {
  User.prototype[resource] = function(query, cb) {
    var resourcePath = this.path + '/' + this.id + '/' + resource;
    var resources = this.client.get(resourcePath, {query: query});
    return cb ? resources.nodeify(cb) : resources;
  };
});

User.prototype.markAsRead = function(roomId, chatIds, cb) {
  var resourcePath = this.path + '/' + this.id + '/troupes/' + roomId + '/unreadItems';
  var resource = this.client.post(resourcePath, {body: {chat: chatIds}});
  return cb ? resource.nodeify(cb) : resource;
};

module.exports = User;
