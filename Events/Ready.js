// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK

const X = require('../X.json');
const chalk = require('chalk');
const moment = require('moment');
const sqlite = require('sqlite');
const sql = require(`../lib/sql.js`);

function log(message) {
  console.log(`[${moment().format('YYYY-MM-DD HH:MM:SS')}] ${message}`);
}


module.exports = async client => {
  var lock = X.Settings.CMDLock;
  if (lock === true) {
    log(chalk.bgBlue.white('CMDLOCK: Active'));
  } else {
    log(chalk.bgBlue.white('CMDLOCK: Disabled'));
  }

  await sqlite.run(sql.createTablePendingVotes);
  await sqlite.run(sql.createTableUsers);
  await sqlite.run(sql.createTableLottery);

  log(chalk.bgGreen.black('Bumper Upvote Service'));
  log(chalk.bgGreen.black('Made By Gizmo#5057'));
  log(chalk.bgBlue.white('Http://CuriosityDiscord.com'));
  log(chalk.bgRed.white('Houston, we are ready to launch'));

  client.user.setPresence({ game: { name: `V2.0`, type: 0 } });
};
