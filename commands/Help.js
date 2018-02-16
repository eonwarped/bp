// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const moment = require('moment');
const RC = require('reaction-core');
const RM = require('../Menu/index.js');
const client = new RC.Client({autoreconnect: true});

exports.info = {
  enabled: true,
  guild: false,
  name: 'help',
  aliases: [`h`],
  lvl: 0,
}

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);
  const howto = '../howto.gif';

  var Intro = new Discord.RichEmbed()
    .setColor(0x1078e0)
    .setAuthor(`Bumper Help Menu (Intro)`)
    .setDescription(`\`\`\`css
Welcome to the brand new Bumper Help menu !
We will use this menu also to update you
with the newests stuff and things on Bumper.

[Use the arrows] to guide your pages, or use
the mag glass to select a page.\`\`\``)

var Update = new Discord.RichEmbed()
  .setColor(0x1078e0)
  .setAuthor(`Bumper Help Menu (Updates)`)
  .setDescription(`\`\`\`css
--------------------------------------------
[New Command]: Queue Steemitname
--------------------------------------------
Check your queue information in
real time ! It does not yet show
your queue position but we will
work on this for the future.
\`\`\``)

var hty = new Discord.RichEmbed()
  .setColor(0x1078e0)
  .setAuthor(`Bumper Help Menu (How to)`)
  .setImage(`https://i.imgur.com/F63bSvm.gif`)
  .setDescription(`Send 0.1 / 0.5 SBD to @Bumper with Blog URL`)

  var cmd = new Discord.RichEmbed()
    .setColor(0x1078e0)
    .setAuthor(`Bumper Help Menu (Commands)`)
    .addField(`[*] Command  -  Usage`, `\`\`\`css
--------------------------
[*] Queue    -  Queue Name
--------------------------\`\`\``)

var more = new Discord.RichEmbed()
  .setColor(0x1078e0)
  .setAuthor(`Bumper Help Menu`)
  .setDescription(`More help menu comming soon`)


    const pages = [Intro, Update, hty, cmd, more];
        let Menu = new RM.Menu(msg.channel)
        for (Page of pages) {
          await Menu.add(Page);
        }
        Menu.send(['search']);

};
