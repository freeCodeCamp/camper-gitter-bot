'use strict';

const test = require('tape'),
      Utils = require('../lib/utils/Utils');

test('Utils tests', t => {
  t.plan(9);

  t.equal(Utils.linkify('wiki', 'wiki'),
          '[wiki](https://github.com/freecodecamp/freecodecamp/wiki/wiki)',
          'should linkify');

  t.equal(Utils.namify('some-page-here'),
          'some page here',
          'should namify');

  t.equal(Utils.sanitize('something-special?.md'),
          'something-special',
          'should sanitize file name strings');

  t.equal(Utils.sanitize('thanks bob', {spaces: false}),
          'thanks bob',
          'sanitize with spaces:false should not remove spaces');

  t.equal(Utils.sanitize('thanks for that', {spaces: true}),
          'thanks-for-that',
          'sanitize with spaces:true should convert spaces to dashes');

  t.test('splitParams command only', st => {
    st.plan(2);
    const res = Utils.splitParams('menu');
    st.equal(res.keyword, 'menu', 'should have menu keyword');
    st.notOk(res.params, 'should have no params');
    st.end();
  });

  t.test('splitParams command and one param', st => {
    st.plan(2);
    const res = Utils.splitParams('menu options');
    st.equal(res.keyword, 'menu', 'should have menu keyword');
    st.equal(res.params, 'options', 'should have options param');
    st.end();
  });

  t.test('splitParams command and multiple params', st => {
    st.plan(2);
    const res = Utils.splitParams('menu with more stuff');
    st.equal(res.keyword, 'menu', 'should have menu keyword');
    st.equal(res.params, 'with more stuff',
             'should have with more stuff params');
    st.end();
  });

  t.equal(Utils.linkify('SomePageName'),
          '[SomePageName](https://github.com/' +
            'freecodecamp/freecodecamp/wiki/SomePageName)',
          'should make a wiki link');
});
