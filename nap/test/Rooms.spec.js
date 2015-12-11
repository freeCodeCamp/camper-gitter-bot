'use strict';

const test = require('tape'),
      Rooms = require('../lib/app/Rooms.js');

test('Rooms tests', t => {
  t.plan(3);

  t.equal(Rooms.findByTopic('bonfires').name,
          'bothelp/HelpBonfires',
          'should find a room for topic');

  t.equal(Rooms.findByName('bothelp/HelpBonfires').name,
          'bothelp/HelpBonfires',
          'should find a room by name');

  t.test('should find a bonfire room', st => {
    st.plan(2);
    const room = Rooms.findByName('bothelp/bonfire-factorialize-a-number');
    st.equal(room.name, 'bothelp/bonfire-factorialize-a-number',
             'name is correct');
    st.equal(room.isBonfire, true, 'should be flagged as bonfire');
    st.end();
  });
});
