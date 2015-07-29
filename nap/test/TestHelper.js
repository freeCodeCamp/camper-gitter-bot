"use strict";

var TestHelper = {

    stubInput: {
        keyword: 'hint',
        params: undefined,
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
        var input = {
            message: {
                room: {
                    name: roomName
                }
            }
        };
        // clog(input);
        return input;
    }

};




module.exports = TestHelper;

