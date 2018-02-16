// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const strings = require('../strings/Queue.js');
const decimal = require('../lib/math.js').decimal;
// const m = require('../strings/Queue.js');
const X = require('../X.json');

exports.info = {
  enabled: true,
  guild: false,
  name: 'test',
  aliases: [],
  lvl: 4,
}

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);

};
