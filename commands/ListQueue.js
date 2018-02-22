// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const decimal = require('../lib/math.js').decimal;

exports.info = {
  enabled: true,
  guild: false,
  name: 'listqueue',
  aliases: [`lq`],
  lvl: 4,
}

async function getNames(msg, send) {
  var Array = [];
  await sqlite.each(sql.dataGetQueueNames, function(err, R) {

    var Index;
    Array.push(`@${R.Name}`);
    for (Index = 0; Index < Array.length; ++Index) {}
  });

  var result = Array.join(' ');
  send(`${result}`, false, true, 'ini');
  console.log(result);
}

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);

  try {
    setTimeout(function() {
      getNames(msg, send);
    }, 5000);

  } catch (e) {
    console.log(e);
    send(e.message);
  }
}
