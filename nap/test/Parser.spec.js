'use strict';

const test = require('tape'),
      GBot = require('../lib/bot/GBot.js'),
      TestHelper = require('./TestHelper');

function testParser(command) {
  const msg = TestHelper.makeMessageFromString(command);
  return GBot.parseInput(msg);
}

test('Parser tests', t => {
  t.plan(2);

  t.test('should find a thanks command', st => {
    st.plan(2);
    const res = testParser('thanks @bob');
    st.equal(res.keyword, 'thanks', 'keyword should be thanks');
    st.ok(res.command);
    st.end();
  });

  t.test('should parse a thanks command with a hashtag', st => {
    st.plan(2);
    const res = testParser('thanks @bob #hashtag');
    st.equal(res.keyword, 'thanks');
    st.ok(res.command);
    st.end();
  });

});
