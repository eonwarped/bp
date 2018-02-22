// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const strings = require('../strings/Queue.js');
const decimal = require('../lib/math.js').decimal;

exports.info = {
  enabled: true,
  guild: false,
  name: 'lottery',
  aliases: [`l`],
  lvl: 3,
}

exports.run = async function(client, msg, args) {

  try {
    const send = messaging.getSend(msg);
    const mentions = msg.mentions.users.first();
    const type = args[0];

    if (!type) return send(`
---------------------------------
Use one of the following commands
---------------------------------
[ Lottery Add @user]
[ Lottery Remove @user ]
[ Lottery Entries ]
[ Lottery Winners ]
---------------------------------`, true, true, 'css');

    if (type === `add`) {
      if (!mentions) return send(`Who to add to the lottery ? \n[ Mention the user ! ]`, true, true, 'css');
      if (mentions) {
        msg.delete();
        msg.channel.send(`\`\`\`css
[ Adding ] User to Database\`\`\``)
          .then(m => {
            m.delete(2800)
          });
        setTimeout(function() {
          msg.channel.send(`\`\`\`ini
User added with [ Success ] !\`\`\``)
            .then(m => {
              m.delete(6800)
            });
        }, 3000);
        setTimeout(async function() {
          await sqlite.run(sql.dataInsertUserLottery, [mentions.username, mentions.id]);
          msg.channel.send(`${mentions}, You are now in the lottery !`);
        }, 10000);
      }
    } else {

      if (type === 'remove') {
        if (!mentions) return send(`Who to add to the lottery ? \n[ Mention the user ! ]`);
        if (mentions) {
          msg.delete();
          msg.channel.send(`\`\`\`css
[ Removing ] User to Database\`\`\``)
            .then(m => {
              m.delete(2800)
            });
          setTimeout(function() {
            msg.channel.send(`\`\`\`ini
User removed with [ Success ] !\`\`\``)
              .then(m => {
                m.delete(6800)
              });
          }, 3000);
          sqlite.run(sql.dataDeleteUserLottery, [mentions.id]);
        }
      }
    }


    if (type === 'entries') {
      async function getNames(msg, send) {
        var Array = [];
        await sqlite.each(sql.dataGetLotteryNames, function(err, R) {

          var Index;
          Array.push(`@${R.Name}`);
          for (Index = 0; Index < Array.length; ++Index) {}
        });

        var result = Array.join(' ');
        send(`${result}`, false, true, 'ini');
      }

      getNames(msg, send);
    }

    if (type === 'winners') {
      msg.delete();
      msg.channel.send(`@everyone`);
      send(`
--------------------------
    [ Lottery Result ]
--------------------------
Fasten your seatbelts.
Lets raffle the winners !

Winners are in order from
the top down starting with
the first place !
--------------------------`);
      await sqlite.each(`SELECT * FROM Lottery ORDER BY RANDOM() LIMIT 3`,
        async function(err, R) {
          var index;
          var Array = [];

          Array.push(`<@${R.ID}>`);
          for (Index = 0; Index < Array.length; ++Index) {
            sqlite.run(sql.dataDeleteUserLotteryName, [R.Name]);
            send(`Winner = [ ${R.Name} ]`, false, true, 'css');
          }

          // setTimeout(function() {
          //   msg.channel.send(Array);
          // }, 5000);
        });

      setTimeout(function() {
        send(`[ Congratulations to this weeks lottery !]`, false, true, 'ini');
      }, 1500);

      setTimeout(function () {
        sqlite.run(sql.dataDeleteLottery);
      }, 7000);
    }

  } catch (e) {
    console.log(e);
    send(e.message);
  }
}
