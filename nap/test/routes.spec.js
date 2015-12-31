'use strict';

const test = require('tape'),
      routes = require('../lib/app/routes.js');

test('Routes tests', t => {
  t.plan(2);

  t.test('should use room from params for route redir', st => {
    st.plan(4);
    const query = {room: 'random'},
          redir = routes.findRedirect(query),
          url = 'https://gitter.im/' + query.room;

    st.ok(redir.room, 'route has a room');
    st.ok(redir.org, 'route has an org');
    st.ok(redir.url, 'route has a url');
    st.equal(redir.url, url, 'route url is correct');
    st.end();
  });

  t.test('should find DM room go URI', st => {
    st.plan(3);
    const query = {room: 'bothelp'},
          redir = routes.findRedirect(query),
          url = 'https://gitter.im/' + query.room;

    st.ok(redir.room, 'route has a room');
    st.ok(redir.url, 'route has a url');
    st.equal(redir.url, url, 'route url is correct');
    st.end();
  });
});
