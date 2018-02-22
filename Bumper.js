
const RC = require('reaction-core');
const RM = require('./Menu/index.js');
const Discord = require('discord.js');
const Settings = require('./Settings/Settings.json');
const client = new RC.Client({autoreconnect: true});
const chalk = require('chalk');
const CH = require('chalk');
const fs = require('fs');
const moment = require('moment');
const sql = require('./lib/sql.js');
const sqlite = require('sqlite');
const messaging = require('./lib/messaging.js');
require('./Events/EventLoader')(client);
require('./Settings/Switches.js')

if (Settings.DevMode === true) {
  client.login(Settings.DevToken);
} else {
  client.login(Settings.Token);
}

// Generates time to display in console.
function log(message) {
  console.log(`[${moment().format('YYYY-MM-DD HH:MM:SS')}] ${message}`);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////     Module Exports     /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// logs console message when user joins server.
client.on('guildMemberAdd', (member) => {
  log(chalk.bgCyan.white.bold(`${member.user.username} joined our server`));
});

// Logs console message when user leave server.
client.on('guildMemberRemove', (member) => {
  log(chalk.bgMagenta.white.bold(`${member.user.username} left our server`));
});

// Loads up all files in the commands folder.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
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
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
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
  // Stops the "Can not read role" error when user joins server.
  if (message.author.bot) return;

  let lvl = 0;
  let Mod = message.guild.roles.find('name', Settings.Staff.Mod);
  if (Mod && message.member.roles.has(Mod.id)) lvl = 2;
  let Admin = message.guild.roles.find('name', Settings.Staff.Admin);
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

  if (input === Settings.Prefix + "settings") {
    const Q = Settings;

    function DEV() {
      if (Settings.DevMode === true) {
        return 'Activated'
      } else {
        return 'Disabled'
      }
    }

      send(`
Version   = [ ${Q.Version} ]
Prefix    = [ ${Q.Prefix} ]

Debug     = [ ${Q.Debug} ]
Refund    = [ ${Q.Refund} ]
CMDLOCK   = [ ${Q.CMDlock} ]

DEV MODE = [ ${DEV()} ]

Min Price = [ ${Q.Price.Min} ]
Max Price = [ ${Q.Price.Max} ]`)

  }

});
