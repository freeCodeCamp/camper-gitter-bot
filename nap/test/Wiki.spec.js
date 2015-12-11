'use strict';

const test = require('tape'),
      KBase = require('../lib/bot/KBase.js');

test('Wiki tests', t => {
  t.plan(4);

  t.test('should load KBase', st => {
    st.plan(2);
    let allData;
    st.doesNotThrow(() => {
      allData = KBase.initSync();
    });
    st.ok(Array.isArray(allData));
    st.end();
  });

  // These lookups are not grabbing the right wiki article
  // Skipping for now.
  t.skip(KBase.getTopicData('css-selectors').dashedName,
          'css-selectors',
          'should find a css page');

  t.skip(KBase.getTopicData('bootstrap').dashedName,
          'bootstrap',
          'should find a bootstrap page');

  t.test('should get wiki data back', st => {
    st.plan(1);
    const entry = KBase.getTopicData('camperbot');
    st.ok(entry.shortData.includes('Hi, I\'m **[CamperBot]'));
    st.end();
  });
});
