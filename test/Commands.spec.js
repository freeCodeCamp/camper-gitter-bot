'use strict';

const test = require('tape');
const GBot = require('../lib/bot/GBot.js');
const BotCommands = require('../lib/bot/BotCommands');
const TestHelper = require('./helpers/TestHelper');

test('Command tests', t => {
  t.plan(4);

  t.test('isCommand: menu true', st => {
    st.plan(1);
    const input = { keyword: 'menu' };
    const res = BotCommands.isCommand(input);
    st.ok(res);
    st.end();
  });

  t.test('isCommand: XXXX false', st => {
    st.plan(1);
    const input = { keyword: 'XXXX' };
    const res = BotCommands.isCommand(input);
    st.notOk(res);
    st.end();
  });

  t.test('should show archives', st => {
    st.plan(2);
    const archive = BotCommands.archive(TestHelper.stubInput);
    st.notEqual(archive, null, 'archive should not be null');
    st.ok(archive.includes('Archives for '), 'should be a valid archive');
    st.end();
  });

  t.test('should have a find command', st => {
    st.plan(3);
    const input = TestHelper.makeInputFromString('find js');
    const res = BotCommands.find(input, GBot);
    st.equal(input.keyword, 'find', 'keyword should be find');
    st.equal(input.params, 'js', 'param should be js');
    st.ok(res.includes('find **js**'), 'response should be valid');
    st.end();
  });

  t.end();
});
