// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK

const Settings = require('../Settings/Settings.json');
const chalk = require('chalk');
const moment = require('moment');
const sqlite = require('sqlite');
const sql = require(`../lib/sql.js`);

function log(message) {
  console.log(`[${moment().format('YYYY-MM-DD HH:MM:SS')}] ${message}`);
}


module.exports = async client => {
  var lock = Settings.CMDlock;
  var debug = Settings.Debug;
  var refund = Settings.Refund;
  var DevMode = Settings.DevMode;

  await sqlite.run(sql.createTablePendingVotes);
  await sqlite.run(sql.createTableUsers);
  await sqlite.run(sql.createTableLottery);

  console.log(`-----------------------------------------`);
  log(chalk.bgBlue.white('Bumper Upvote Service'));
  log(chalk.bgBlue.white('Made By Gizmo#5057'));
  log(chalk.bgCyan.white('Http://CuriosityDiscord.com'));
  log(chalk.bgMagenta.white('Discord Connection Online'));
  console.log(`-----------------------------------------`);

  client.user.setPresence({
    game: {
      name: Settings.Version,
      type: 0
    }
  });

  console.log(`---------------- Settings ----------------`);
  if (debug === true) {
    log(chalk.bgGreen.white.bold('Debug: Active'));
    setTimeout(function() {
      console.log(chalk.bgRed.white.bold(`
-------------------------------------
    WARNING: You'r in debug mode !  .
-------------------------------------`));
    }, 5000);
  } else {
    log(chalk.bgBlue.white.bold('Debug: Disabled'));
  }

  if (refund === true) {
    log(chalk.bgGreen.white.bold('Refund: Active'));
  } else {
    log(chalk.bgBlue.white.bold('Refund: Disabled'));
  }

  if (lock === true) {
    log(chalk.bgGreen.white.bold('CMDLock: Active'));
    setTimeout(function() {
      console.log(chalk.bgRed.white.bold(`
----------------------------------------------
  WARNING: CMD Lock - Auto Restart Disabled  .
----------------------------------------------`));
    }, 5000);
  } else {
    log(chalk.bgBlue.white.bold('CMDlock: Disabled'));
  }

  if (DevMode === true) {
    log(chalk.bgGreen.white.bold('DEVMODE: Active'));
  } else {
    log(chalk.bgBlue.white.bold('DEVMODE: Disabled'));
  }
  console.log(`-----------------------------------------`);
};
