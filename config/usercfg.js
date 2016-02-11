var config = {
  // replace 'YOUR_GITHUB_ID' with your github username
  githubId = 'YOUR_GITHUB_ID'
  user: {
    botname: config.githubId,
    appHost: 'http://localhost:7000',
    apiServer: 'freecodecamp.com',
    appRedirectUrl: 'http://localhost:7891/login/callback'
  },
  room: {
    title: 'bothelp',
    name: config.githubId + '/testing',
    icon: 'question',
    topics: ['chitchat', 'bots', 'bot-development', 'camperbot']
  }

}

module.exports = config;
