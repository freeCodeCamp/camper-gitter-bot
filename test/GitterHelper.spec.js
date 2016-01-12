'use strict';

const test = require('tape'),
      GitterHelper = require('../lib/gitter/GitterHelper');

const TEST_ROOM_NAME = 'camperbot/localdev';

test('GitterHelper tests', t => {
  t.plan(3);

  t.test('GitterHelper should find room by name', st => {
    st.plan(1);
    const foundRoom = function(blob) {
      const foundRoomName = blob.gitterRoom.uri.toLowerCase();
      st.equal(foundRoomName, TEST_ROOM_NAME);
      st.end();
    };
    GitterHelper.findRoomByName(TEST_ROOM_NAME, foundRoom);
  });

  t.test('GitterHelper should store room info in cache', st => {
    st.plan(1);
    const foundRoom2 = function() {
      const cachedRoom = GitterHelper.roomDataCache[TEST_ROOM_NAME];
      st.equal(cachedRoom.uri, TEST_ROOM_NAME);
      st.end();
    };
    GitterHelper.findRoomByName(TEST_ROOM_NAME, foundRoom2);
  });

  t.doesNotThrow(() => {
    GitterHelper.sayToRoomName('autotest', TEST_ROOM_NAME);
  }, 'should send a message to a named room');
});
