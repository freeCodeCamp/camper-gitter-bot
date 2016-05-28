'use strict';

const fs = require('fs');
const path = require('path');
const test = require('tape');
const TextLib = require('../lib/utils/TextLib');

test('TextLib tests', t => {
  t.plan(2);

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
    const short = TextLib.trimLines(longTextBlock, 5);
    const split = short.split('\n');
    st.equal(split.length, 5, 'should have trimmed correct number of lines');
    st.ok(split[0].includes('# Headline'), 'first line should be correct');
    st.ok(split[split.length - 1].includes('line 4'),
          'last line should be correct');
    st.end();
  });

  t.test('should trim camperbot entry', st => {
    st.plan(3);
    let topicData = fs.readFileSync(path.resolve(__dirname,
      'helpers/testWikiArticle.md')).toString();
    let short = TextLib.trimLines(topicData);
    let split = short.split('\n');
    st.equal(split.length, 12, 'should have trimmed correct number of lines');
    st.ok(split[0].includes('Hi, I\'m **[CamperBot'),
          'first line should be correct');
    st.equal(split[split.length - 1], '',
          'last line should be correct');
    st.end();
  });

  t.end();
});
