// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const m = require('../strings/Queue.js');

exports.info = {
  enabled: true,
  guild: false,
  name: 'queue',
  aliases: [],
  lvl: 0,
}

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);
  const steemit = args[0];
  console.log(steemit+' lookup queue position');

  if (!steemit) {
    send(m.noName(), true, true, 'css');
    send(m.usage(), true, true, 'ini');
    return;
  };

  var Array = [];
  await sqlite.each(`SELECT * FROM PendingUpvotes WHERE Name LIKE '%${steemit}%'`, function(err, R) {
    var Index;
    Array.push(`${R.Blog}.\n\n`);
    for (Index = 0; Index < Array.length; ++Index) {}
  });

  var result = Array.join(' ');

  if (!result) return send(`[@${steemit}] has nothing in queue at this time !`, false, true, 'ini');

  send(`These are the blogs [@${steemit}] has in queue !`);
  send(result);
};
