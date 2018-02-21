const Discord = require('discord.js');
const client = new Discord.Client();
const Settings = require('../Settings/Settings.json');
const chalk = require('chalk');
const moment = require('moment');
const messaging = require('../lib/messaging.js');
const sqlite = require('sqlite');
sqlite.open(`./db.sqlite`);

module.exports = async msg => {

  // if (msg.author.bot) return;
  if (msg.channel.type == "dm") return;
  // if (msg.author.bot) return;

  let client = msg.client;
  const send = messaging.getSend(msg);
  const prefix = Settings.Prefix;

  // Checks the command settings you can find at the top
  // of every commands file. These are the settings.
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.toLowerCase().split(' ')[0].slice(prefix.length);
  let perms = client.elevation(msg);
  let args = msg.content.split(' ').slice(1);
  let cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.info.lvl) {
      // send Errors when not having the right permissions.
      send(`ERROR: [ No Permission to do that ! ]`, true, true, 'css');
    } else {
      if (cmd.info.guild == true && msg.channel.type == "dm") {
        send(strings.serverOnly(), true, true, 'css');
      }
      if (!msg.channel.type == "dm" && !msg.guild.member(client.user)
        .hasPermission(0x00004000))
        send(strings.embedPermission(), true, true, 'css');
      cmd.run(client, msg, args, perms);
    }
  }

};
