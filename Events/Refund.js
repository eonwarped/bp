const DB = require('sqlite');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const chalk = require('chalk');
const X = require('../X.json');
const decimal = require('../lib/math.js').decimal;

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
`Bumper Refund: Pre-Order is temporarily closed !
More info @ https://discord.gg/3TsSTyf or visit our blog
https://steemit.com/bumper/@bumper/bumper-update-pre-order-temporarily-closed`
    ];

    var voting = [
      `Bumper Refund: We are currently voting !
      During the voting process we are unable to to accept
      new blogs as this will interfere with out database.
      Please try again in a few minutes.
      More info @ https://discord.gg/3TsSTyf`
    ];

    if (type === 'SBD') {
      if (coin <= 3) {
          responder.sendSbd(data.amount, voting);
          return log(chalk.bgGreen.white.bold(`User ${data.from}, Refunded.. No more room`))
      }
    }

  };

  console.log(chalk.bgGreen.white.bold('BUMPER REFUND ONLINE'));
  if (X.Settings.Debug === true) {
    bot.onDeposit('steembust', handleDeposit);
  } else {
    bot.onDeposit('bumper', handleDeposit);
  }
  bot.start();
  return

};
