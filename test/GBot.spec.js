'use strict';

const test = require('tape');
const AppConfig = require('../config/AppConfig');
const GBot = require('../lib/bot/GBot');
const TestHelper = require('./helpers/TestHelper');
const KBase = require('../lib/bot/KBase');

function testMessage(command) {
  const message = TestHelper.makeMessageFromString(command);
  return GBot.findAnyReply(message);
}

test('GBot tests', t => {
  t.plan(8);

  t.doesNotThrow(() => {
    KBase.initSync();
  }, 'kbase should load');

  t.equal(GBot.getName(), 'bothelp', 'bot should have a name');

  t.test('GBot should not reply to itself', st => {
    st.plan(1);
    const botname = AppConfig.getBotName();
    const flag = GBot.isBot(botname);
    st.ok(flag);
    st.end();
  });

  t.test('GBot should format non-help as false command', st => {
    st.plan(1);
    const input = TestHelper.makeMessageFromString('DONT bootstrap');
    const output = GBot.parseInput(input);
    st.notOk(output.command, 'should return false');
    st.end();
  });

  t.skip('GBot should respond to wiki migration', st => {
    st.plan(1);
    const res = testMessage('wiki');
    console.log(res);
    st.ok(res.includes('forum'));
    st.end();
  });

  t.test('GBot should have a botstatus response', st => {
    st.plan(1);
    const res = testMessage('botstatus');
    st.ok(res.includes('All bot systems are go!'));
    st.end();
  });

  t.test('GBot should send a thanks karma reply', st => {
    st.plan(1);
    const res = testMessage('thanks @bob');
    st.ok(res.includes('testuser sends brownie points to'));
    st.end();
  });

  t.test('GBot should have a find command', st => {
    st.plan(1);
    const res = testMessage('find XXX');
    st.ok(res.includes('find **'));
    st.end();
  });

  t.end();
});
