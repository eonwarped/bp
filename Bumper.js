
const RC = require('reaction-core');
const RM = require('./Menu/index.js');
const Discord = require('discord.js');
const X = require('./X.json');
const client = new RC.Client({autoreconnect: true});
const CH = require('chalk');
const fs = require('fs');
const moment = require('moment');
const sql = require('./lib/sql.js');
const sqlite = require('sqlite');
const messaging = require('./lib/Messaging.js');
require('./events/eventLoader')(client);
require('./steemit.js')

client.login(X.Bot.Token);

// Generates time to display in console.
function log(message) {
  console.log(`[${moment().format('YYYY-MM-DD HH:MM:SS')}] ${message}`);
}


////////////////////////////////////////////////////////////////////////////////
///////////////////////////     Module Exports     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Loads up all files in the commands folder.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./Commands/${f}`);
    log(`Loading Command: ${props.info.name}. 👌`);
    client.commands.set(props.info.name, props);
    props.info.aliases.forEach(alias => {
      client.aliases.set(alias, props.info.name);
    });
  });
});

// reloads the files when reload is executed.
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./Commands/${command}`)];
      let cmd = require(`./Commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.info.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.info.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

////////////////////////////////////////////////////////////////////////////////
///////////////////////////     Permission Lvls    /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// this will check the level of permissions on every commands file.
client.elevation = message => {
  let lvl = 0;
  let Mod = message.guild.roles.find('name', X.Staff.Mod);
  if (Mod && message.member.roles.has(Mod.id)) lvl = 2;
  let Admin = message.guild.roles.find('name', X.Staff.Admin);
  if (Admin && message.member.roles.has(Admin.id)) lvl = 3;
  if (message.author.id === "189975082070704128") lvl = 4;
  return lvl;
};

////////////////////////////////////////////////////////////////////////////////
///////////////////////////     Client Messages    /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

client.on('message', async msg => {
  const send = messaging.getSend(msg);
  const input = msg.content.toLowerCase();

  if (msg.author.bot) return;

  if (input === "settings") {
    const Q = X.Settings;
      send(`
Version   = [ ${X.Bot.Version} ]
Debug     = [ ${Q.Debug} ]
Refund    = [ ${Q.Refund} ]
Min Price = [ ${Q.Min} ]
Max Price = [ ${Q.Max} ]`)

  }

});
