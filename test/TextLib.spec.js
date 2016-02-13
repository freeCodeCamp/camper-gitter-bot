'use strict';

const test = require('tape'),
      TextLib = require('../lib/utils/TextLib'),
      KBase = require('../lib/bot/KBase');

test('TextLib tests', t => {
  t.plan(3);

  t.doesNotThrow(() => {
    KBase.initSync();
  }, 'kbase should load');

  var longTextBlock = `# Headline
  line 1
  line 2
  line 3
  line 4
  line 5
  line 6
  line 7
  line 8
  line 9
  line 10
  `;

  t.test('should take the first 5 lines of a chunk', st => {
    st.plan(3);
    const short = TextLib.trimLines(longTextBlock, 5),
          split = short.split('\n');
    st.equal(split.length, 5, 'should have trimmed correct number of lines');
    st.ok(split[0].includes('# Headline'), 'first line should be correct');
    st.ok(split[split.length - 1].includes('line 4'),
          'last line should be correct');
    st.end();
  });

  t.test('should trim camperbot entry', st => {
    st.plan(3);
    const params = 'camperbot',
          topicData = KBase.getTopicData(params),
          short = TextLib.trimLines(topicData.data),
          split = short.split('\n');
    st.equal(split.length, 12, 'should have trimmed correct number of lines');
    st.ok(split[0].includes('Hi, I\'m **[CamperBot'),
          'first line should be correct');
    st.equal(split[split.length - 1], '\r',
          'last line should be correct');
    st.end();
  });
});
