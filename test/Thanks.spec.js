'use strict';

const test = require('tape'),
      GBot = require('../lib/bot/GBot'),
      TestHelper = require('./TestHelper');

test('Thanks tests', t => {
  t.plan(1);

  t.test('should work for two users', st => {
    st.plan(1);
    var msg = TestHelper.makeInputFromString('thanks @dcsan @bob'),
        res = GBot.findAnyReply(msg.message);
    st.ok(res.includes('> testuser sends brownie points to ' +
                       '@dcsan and @berkeleytrue'));
    st.end();
  });
});
