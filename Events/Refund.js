const DB = require('sqlite');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const chalk = require('chalk');
const decimal = require('../lib/math.js').decimal;
const Settings = require('../Settings/Settings.json');

module.exports = async function(bot) {

  // Generates time to display in console.
  function log(message) {
    console.log(`[${moment().format('YYYY-MM-DD HH:MM:SS')}] ${message}`);
  }

  function CheckAmount(amount) {
    const nums = ['.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ' ']; // 'S', 'B', 'D', 'T', 'E'
    var type = "";
    for (var i = 0; i < amount.length;) {
      if (nums.includes(amount.charAt(i))) {
        i++
      } else {
        type += amount.charAt(i);
        i++
      }
    }
    return type;
  }


  async function handleDeposit(data, responder) {
    var type = CheckAmount(data.amount);
    var coin = decimal(parseFloat(data.amount), -3);

    const Time = moment().format('DD-MM-YYYY, HH:MM');


    var closed = [
`Bumper Refund: Our pre-order list has received
the maximum amount of requests. Therefore our pre-order
list is temporarily closed. We will open once again soon.
For more info please visit https://discord.gg/3TsSTyf`
    ];

    if (type === 'SBD') {
      if (coin <= 3) {
        if (coin >= 0.1) {
          responder.sendSbd(data.amount, closed);
          return log(chalk.bgGreen.white.bold(`User ${data.from}, Refunded.. No more room`))
        }
      }
    }

  };

  setTimeout(function () {
    log(chalk.bgGreen.white.bold('BUMPER REFUND ONLINE'));
  }, 3000);
  if (Settings.Debug === true) {
    bot.onDeposit('steembust', handleDeposit);
  } else {
    bot.onDeposit('bumper', handleDeposit);
  }
  bot.start();
  return

};
