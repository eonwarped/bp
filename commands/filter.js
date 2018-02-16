// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const strings = require('../strings/Queue.js');
const decimal = require('../lib/math.js').decimal;
const X = require('../X.json');

exports.info = {
  enabled: true,
  guild: false,
  name: 'filter',
  aliases: [`f`],
  lvl: 4,
}

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);
  if (X.Settings.CMDLock === true) {
    send(`Commands currently disabled !`);
  } else {
    const send = messaging.getSend(msg);
        var Array = [];
        await sqlite.each(`select * from PendingUpvotes group by Name having count(*) > 1 limit 100`, function(err, R) {

          var Index;
          Array.push(`@${R.Name}`);
          for (Index = 0; Index < Array.length; ++Index) {}
        });

        var result = Array.join(' ');
        send(`${result}`, false, true, 'ini');
  }



}
