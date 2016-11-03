'use strict';

const test = require('tape');
const GBot = require('../lib/bot/GBot');
const TestHelper = require('./helpers/TestHelper');

test('Thanks tests', t => {
  t.plan(1);

  t.test('should work for two users', st => {
    st.plan(1);
    const msg = TestHelper.makeInputFromString('thanks @dcsan @bob');
    const res = GBot.findAnyReply(msg.message);
    st.ok(res.includes('> testuser sends brownie points to ' +
                       '@dcsan and @berkeleytrue'));
    st.end();
  });
});
