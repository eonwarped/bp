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
    var memo = data.memo;
    var cost = decimal(parseFloat(0.001), -3);

    const Time = moment().format('DD-MM-YYYY, HH:MM');

    var wait = [
`Bumper: We have received your transaction.
The upvote are done manually twice a day and you get it from @bumper or @flagship.
NOTE: Currently it takes up to 3 days before you get your vote due to demand.
You can see your Queue Position on our "Daily Report" blog.
More info @ ${X.Bot.Server}`
    ]

    var high = [
`Bumper Refund: You've send to much. !
Minimums is 0.1 and maximum we accept 0.5 SBD per blog.
More info @ ${X.Bot.Server}`
    ];

	var low = [
`Bumper Refund: You've send to little.
Minimums is 0.1 and maximum we accept 0.5 SBD per blog.
More info @ ${X.Bot.Server}`
	];

  var blmsg = [
    `Bumper Refund: You'r blacklisted from our service!
    This can be dure to plagiarism, spammer or ID theft.
    You will be unable to use the bumper service.
    More info @ ${X.Bot.Server}`
  ]

  var black = [
    `rohu03`, `bollywoodtown`
  ]

    if (type === 'SBD') {
      if (data.from === `${black}`) {
        console.log(`user blacklisted`);
          return responder.sendSbd(data.amount, blmsg);
      }

      if (coin <= 0.5) {
        if (coin >= 0.1) {
          // check if user has already sent one for today
          const numSendsToday = await sqlite.get(sql.dataCheckUser, [data.from, moment(Time,'DD-MM-YYYY, HH:MM').format('DD-MM-YYYY')]);

          if (numSendsToday.c > 0) {
            // TODO: reject, already done.
          }

          await sqlite.run(sql.dataInsertUser, [data.from, data.amount, Time, data.memo]);
          responder.sendSteem(cost, wait);
          return log(chalk.bgGreen.white.bold(`User ${data.from}, Just bought an upvote of ${data.amount}`))
        }
      }

	  if (coin > 0.5) {
		  if (coin < 5) {
			  responder.sendSbd(data.amount, high);
				return log(chalk.bgYellow.white.bold(`User ${data.from}, Send to much.. -- Refund --`))
		  }
	  }

	    if (coin < 0.1) {
        if (coin > 0.01) {
			responder.sendSbd(data.amount, low);
			return log(chalk.bgYellow.white.bold(`User ${data.from}, Send to little.. -- Refund --`))
  }
}

    }
  };

  console.log(chalk.bgGreen.white.bold('BUMPER ReSteem POSTER ONLINE'));
  if (X.Settings.Debug === true) {
    bot.onDeposit('steembust', handleDeposit);
  } else {
    bot.onDeposit('bumper', handleDeposit);
  }
  bot.start();
  return

};
