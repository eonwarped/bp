// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');

exports.info = {
  enabled: true,
  guild: false,
  name: 'restart',
  aliases: [],
  lvl: 3,
}

exports.run = async function(client) {

  if (Settings.CMDlock === true) {
    return;
  }

  console.log(`RESTARTING ON AUTOPILOT`);
  console.log(`RESTARTING ON AUTOPILOT`);
  console.log(`RESTARTING ON AUTOPILOT`);
  console.log(`RESTARTING ON AUTOPILOT`);
  return process.exit();;
}
