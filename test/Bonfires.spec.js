'use strict';

const test = require('tape'),
      Bonfires = require('../lib/app/Bonfires.js'),
      InputWrap = require('../lib/bot/InputWrap'),
      TestHelper = require('./TestHelper'),
      GBot = require('../lib/bot/GBot.js'),
      KBase = require('../lib/bot/KBase.js');

const TESTROOMNAME = 'bonfire-factorialize-a-number',
      TEST_BF_NAME = 'bonfire factorialize a number',
      TEST_BF_TITLE = 'Bonfire Factorialize a Number';

// sets a bonfire as active inside the current chat
function testMessage(command) {
    const message = TestHelper.makeMessageFromString(command);
    return GBot.findAnyReply(message);
}

test('Bonfires test', t => {
  t.plan(11);

  // activate Bonfire
  testMessage('bonfire ' + TEST_BF_TITLE);

  t.notEqual(Bonfires.load().data.challenges[0], null,
              'should load the Bonfies');

  t.test('test find bonfire and stubInput', st => {
    st.plan(3);

    const bfName = TESTROOMNAME,
          bf = Bonfires.findBonfire(bfName);

    st.equal(bf.dashedName, bfName, 'should find a bonfire by roomname');
    st.equal(TestHelper.stubInput.message.room.name, `bothelp/${bfName}`,
            'stubInput test 1');

    const sname = InputWrap.roomShortName(TestHelper.stubInput);
    st.equal(sname, bfName, 'stubInput test 2');
    st.end();
  });

  t.equal(Bonfires.allDashedNames()[0],
          'waypoint-pair-program-on-bonfires',
          'initialize allDashedNames');

  t.equal(Bonfires.allNames()[0],
          'Waypoint: Pair Program on Bonfires',
          'initialize allNames');

  t.test('findBonfire tests', st => {
    st.plan(3);
    const testBf = Bonfires.findBonfire(TEST_BF_NAME),
          testDesc = testBf.description[0],
          testLinks = Bonfires.getLinks(testBf);

    st.equal(testDesc,
            'Return the factorial of the provided integer.',
            'should find bonfire from lowercase name');
    st.notEqual(testLinks, null, 'links should not be null');
    st.ok(testLinks.includes('links:'), 'links has valid formatting');
    st.end();
  });

  t.test('should respond to bonfire details', st => {
    st.plan(1);
    const res = testMessage('bonfire details');
    st.ok(res.includes('## :fire:[Bonfire'));
    st.end();
  });

  t.test('should respond to bonfire links', st => {
    st.plan(1);
    const res = testMessage('bonfire links');
    st.ok(res.includes('links:'));
    st.end();
  });

  t.test('should respond to bonfire script', st => {
    st.plan(1);
    const res = testMessage('bonfire script');
    st.ok(res.includes('```js \nfunction'));
    st.end();
  });

  t.test('should respond to hints command', st => {
    st.plan(1);
    const res = testMessage('hint');
    st.ok(res.includes('> :construction: Spoilers'));
    st.end();
  });

  t.test('should find raw wiki hints from KBase', st =>{
    st.plan(1);
    const hints = KBase.getWikiHints(TEST_BF_TITLE);
    st.ok(Array.isArray(hints));
    st.end();
  });

  t.test('should have wikiHints linked to bonfire object', st =>{
    st.plan(1);
    const bf = Bonfires.findBonfire(TEST_BF_TITLE);
    st.ok(Array.isArray(bf.hints));
    st.end();
  });

  t.end();
});
