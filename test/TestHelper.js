'use strict';

const GBot = require('../lib/bot/GBot');

const TestHelper = {
  aboutInput: {
    keyword: 'about',
    params: '@bothelp ',
    message: {
      operation: 'create',
      model: {
        id: '55b95acb5bc8dc88744243ff',
        text: 'about @bothelp',
        html: 'about <span data-link-type="mention" data-screen-name' +
              '="bothelp" class="mention">@bothelp</span> ',
        sent: '2015-07-29T22:59:23.187Z',
        editedAt: null,
        fromUser: {
          username: 'testuser'
        },
        unread: true,
        readBy: 0,
        urls: [],
        mentions: [
          {screenName: 'dcsan'},
          {screenName: 'berkeleytrue'}
        ],
        issues: [],
        meta: {},
        v: 1
      },
      room: {
        path: '/rooms',
        id: '55b3d5780fc9f982beaaf7f4',
        name: 'camperbot/localdev',
        topic: ' testing',
        uri: 'camperbot/localdev',
        oneToOne: false,
        userCount: 5,
        unreadItems: 100,
        mentions: 27,
        lastAccessTime: '2015-07-29T14:41:04.820Z',
        lurk: false,
        url: '/camperbot/localdev',
        githubType: 'USER_CHANNEL',
        security: 'PUBLIC',
        noindex: false,
        v: 1,
        client: [Object],
        faye: [Object],
        _events: [Object]
      }
    },
    cleanText: 'about @bothelp ',
    command: true
  },

  stubInput: {
    keyword: 'hint',
    params: null,
    message: {
      operation: 'create',
      model: {
        id: '55b91175c35e438c74fc725c',
        text: 'hint',
        html: 'hint',
        sent: '2015-07-29T17:46:29.190Z',
        editedAt: null,
        fromUser: [Object],
        unread: true,
        readBy: 0,
        urls: [],
        mentions: [],
        issues: [],
        meta: {},
        v: 1
      },
      room: {
        path: '/rooms',
        id: '55b8fc980fc9f982beab6b19',
        name: 'bothelp/bonfire-factorialize-a-number',
        topic: '',
        uri: 'bothelp/bonfire-factorialize-a-number',
        oneToOne: false,
        userCount: 3,
        unreadItems: 9,
        mentions: 0,
        lastAccessTime: '2015-07-29T16:17:28.850Z',
        lurk: false,
        url: '/bothelp/bonfire-factorialize-a-number',
        githubType: 'USER_CHANNEL',
        security: 'PUBLIC',
        noindex: false,
        client: [Object],
        faye: [Object],
        _events: [Object]
      }
    },
    cleanText: 'hint',
    command: true
  },

  mockInput: function(roomName) {
    const input = {
      message: {
        room: {
          name: roomName
        }
      }
    };

    return input;
  },

  // used for tests
  // and also strings to commands
  // https://developer.gitter.im/docs/messages-resource
  // makeInputFromString: function (text) {
  //     var message = {};
  //     var model = {
  //         text: text
  //     };
  //     message.model = model;
  //     return message;
  // },

  makeInputFromString: function(text) {
    let input = TestHelper.aboutInput;
    // initialize before parsing
    input.message.model.text = text;
    // add keywords etc.
    input = GBot.parseInput(input.message);

    input.message.model.text = text;
    input.message.model.fromUser = {
      username: 'testuser'
    };
    return input;
  },

  makeMessageFromString: function(text) {
    const input = TestHelper.makeInputFromString(text);
    return input.message;
  }
};

module.exports = TestHelper;
