'use strict';

const KBase = require('../../bot/KBase'),
    Utils = require('../../../lib/utils/Utils');

const commands = {

  wikiFooter: function(params) {
    const text = ('read more about ' + params + ' on the FCC Wiki'),
          link = Utils.linkify(params, 'wiki', text);

    return '\n:pencil: ' + link;
  },

  wikiUsage: function() {
    return 'usage:\n    `wiki $topic`   info on that topic';
  },

  wikiCantFind: function(input) {
    Utils.warn('wiki.js', 'cant find topic for', input.params);
    return 'no wiki entry for: `' + input.params + '`';
  },

  wiki: function(input) {
    if (!input.params) {
      return this.wikiUsage();
    }

    const topicData = KBase.getTopicData(input.params);
    if (!topicData) {
      Utils.warn('cant find topic for ', input.params);
      return this.wikiCantFind(input);
    }

    Utils.log('topicData', topicData);
    const link = Utils.linkify(topicData.dashedName, 'wiki',
                               topicData.displayName + '  [wiki]');

    return '## :point_right: ' + link + '\n' + topicData.shortData +
      this.wikiFooter(topicData.dashedName);
  }
};

module.exports = commands;
