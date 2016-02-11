var config = {
  // replace 'YOUR_GITHUB_ID' with your github username
  user: {
    botname: 'YOUR_GITHUB_ID',
    appHost: 'http://localhost:7000',
    apiServer: 'freecodecamp.com',
    appRedirectUrl: 'http://localhost:7891/login/callback'
  },
  room: {
    title: 'bothelp',
    name: 'YOUR_GITHUB_ID' + '/testing',
    icon: 'question',
    topics: ['chitchat', 'bots', 'bot-development', 'camperbot']
  }

}

module.exports = config;
