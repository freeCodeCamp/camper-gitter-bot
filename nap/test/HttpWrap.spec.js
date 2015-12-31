'use strict';

const test = require('tape'),
      HttpWrap = require('../lib/utils/HttpWrap.js');

test('HttpWrap tests', t => {
  t.plan(1);
  const name = 'berkeleytrue',
        apiPath = '/api/users/about?username=' + name,
        options = {method: 'GET'};

  HttpWrap.callApi(apiPath, options, apiResult => {
    t.equal(apiResult.response.about.username, 'berkeleytrue',
            'should return correct username');
    t.end();
  });
});
