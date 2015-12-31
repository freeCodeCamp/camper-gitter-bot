'use strict';

const test = require('tape'),
      AppConfig = require('../config/AppConfig'),
      GBot = require('../lib/bot/GBot'),
      TestHelper = require('./TestHelper'),
      KBase = require('../lib/bot/KBase');

function testMessage(command) {
    const message = TestHelper.makeMessageFromString(command);
    return GBot.findAnyReply(message);
}

test('GBot tests', t => {
  t.plan(11);

  t.doesNotThrow(() => {
    KBase.initSync();
  }, 'kbase should load');

  t.equal(GBot.getName(), 'bothelp', 'bot should have a name');

  t.test('GBot should not reply to itself', st => {
    st.plan(1);
    const botname = AppConfig.getBotName(),
          flag = GBot.isBot(botname);
    st.ok(flag);
    st.end();
  });

  t.test('GBot should parse wiki input', st => {
    st.plan(2);
    const input = TestHelper.makeInputFromString('wiki bootstrap'),
          output = GBot.parseInput(input.message);
    st.equal(output.keyword, 'wiki', 'has correct keyword prop');
    st.equal(output.params, 'bootstrap', 'has correct params prop');
    st.end();
  });

  t.test('GBot should format non-help as false command', st => {
    st.plan(1);
    const input = TestHelper.makeMessageFromString('DONT bootstrap'),
          output = GBot.parseInput(input);
    st.notOk(output.command, 'should return false');
    st.end();
  });

  t.skip('GBot should respond to wiki bootstrap', st => {
    st.plan(1);
    const res = testMessage('wiki bootstrap');
    console.log(res);
    t.ok(res.includes('## :point_right: [bootstrap'));
    t.end();
  });

  t.test('GBot should have a botstatus response', st => {
    st.plan(1);
    const res = testMessage('botstatus');
    st.ok(res.includes('All bot systems are go!'));
    st.end();
  });

  t.test('GBot should have a menu command', st => {
    st.plan(1);
    const res = testMessage('menu');
    st.ok(res.includes('type help for a list'));
    st.end();
  });

  t.test('GBot should have a help command', st => {
    st.plan(1);
    const res = testMessage('help');
    st.ok(res.includes('Hi, I\'m **[CamperBot]'));
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
});
