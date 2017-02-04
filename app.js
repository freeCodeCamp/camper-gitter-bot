'use strict';

require('dotenv').config({ path: '.env' });

console.log('--------------- startup ------------------');

if (typeof Map !== 'function') {
  throw new Error('ES6 is required; add --harmony');
}
const GBot = require('./lib/bot/GBot');
GBot.init();
console.log('camperbot running locally');
