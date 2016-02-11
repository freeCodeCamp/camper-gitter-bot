var githubId = 'GITHUB_USER_ID';
var config = {
  // replace 'GITHUB_USER_ID' with your github username
  githubId: githubId,
  user: {
    botname: githubId,
    appHost: 'http://localhost:7000',
    apiServer: 'freecodecamp.com',
    appRedirectUrl: 'http://localhost:7891/login/callback'
  },
  rooms: [
    {
      title: 'bothelp',
      name: githubId + '/b0t',
      icon: 'question',
      topics: ['chitchat', 'bots', 'bot-development', 'camperbot']
    },
  ]
}

module.exports = config;
