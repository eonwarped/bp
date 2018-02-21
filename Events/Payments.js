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
    var cost = decimal(parseFloat(0.001), -3);
    var memo = data.memo;
    var amount = data.amount;
    var who = data.from;

    const Time = moment().format('DD-MM-YYYY, HH:MM');

    var wait = [
      `Bumper: We have received your transaction.
The upvote are done manually twice a day and you get it from @bumper or @flagship.
NOTE: Currently it takes up to 3 days before you get your vote due to demand.
You can see your Queue Position on our "Daily Report" blog.
More info @ ${Settings.Server}`
    ]

    var high = [
      `Bumper Refund: You've send to much. !
Minimums is 0.1 and maximum we accept 0.5 SBD per blog.
More info @ ${Settings.Server}`
    ];

    var low = [
      `Bumper Refund: You've send to little.
Minimums is 0.1 and maximum we accept 0.5 SBD per blog.
More info @ ${Settings.Server}`
    ];

    var blmsg = [
      `Bumper Refund: You'r blacklisted from our service!
    This can be dure to plagiarism, spammer or ID theft.
    You will be unable to use the bumper service.
    More info @ ${Settings.Server}`
    ];

    var dailyLimit = [
      `Bumper Refund: You've already requested a vote today!
    Only one request per user per day.
    More info @ ${Settings.Server}`
    ];

    var blacklist = [
      {steemit: `rohu03`, date: '2 Feb 2018'},
      {steemit: `bollywoodtown`, date: `2 Feb 2018`},
      {steemit: `andybarmer`, date: `2 Feb 2018`},
      {steemit: `blokbook`, date: `2 Feb 2018`},
      {steemit: `auomura`, date: `2 Feb 2018`},
      {steemit: `princecom`, date: `2 Feb 2018`},
      {steemit: `gokufahim`, date: `2 Feb 2018`},
      {steemit: `vichetuc`, date: `2 Feb 2018`},
      {steemit: `renasampson`, date: `2 Feb 2018`},
      {steemit: `shardaprasad`, date: `2 Feb 2018`},
      {steemit: `dlaur`, date: `2 Feb 2018`},
      {steemit: `onahski`, date: `14 Feb 2018`},
      {steemit: `kral789`, date: `14 Feb 2018`},
      {steemit: `shinysword`, date: `17 Feb 2018`},
      {steemit: `the.dragon`, date: `18 Feb 2018`},
      {steemit: `emmawill`, date: `18 Feb 2018`},
      {steemit: `terz17`, date: `19 Feb 2018`},
      {steemit: `panamamama`, date: `19 Feb 2018`},
      {steemit: `foodforcomfort`, date: `21 Feb 2018`},
      {steemit: `badchistes`, date: `21 Feb 2018`}
    ];

    var whitelist = [
      {steemit: `earthnation`, date: `21 Feb 2018`},
      {steemit: `ensteemit`, date: `21 Feb 2018`}
    ];

    function findObjectByKey(array, key, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
          return array[i];
        }
      }
      return null;
    }

    var black = findObjectByKey(blacklist, 'steemit', who);
    var white = findObjectByKey(whitelist, 'steemit', who);


    if (type === 'SBD') {
      // Find Steemit user on black or whitelist
      var black = findObjectByKey(blacklist, 'steemit', who);
      var white = findObjectByKey(whitelist, 'steemit', who);

      if (black) {
        // Blacklist users are not able to use the
        // the bumper service at all.
        responder.sendSbd(amount, 'Testing Blacklist');
        log(chalk.bgRed.white.bold(`BLACKLIST: ${who} got refunded`));
        return;

      } else {
        if (white) {
          // Whitelist users are able to send more blogs
          // a day then the limit is set to.
          await sqlite.run(sql.dataInsertUser, [data.from, data.amount, Time, data.memo]);
          responder.sendSteem(cost, wait);
          return log(chalk.bgBlue.white.bold(`WHITELIST: ${data.from}, Just bought an upvote of ${data.amount}`));
        }
      }

      if (coin <= 0.5) {
        if (coin >= 0.1) {

          // check if user has already sent one for today
          const extractedDate = moment(Time, 'DD-MM-YYYY, HH:MM').format('DD-MM-YYYY');
          const numSendsToday = await sqlite.get(sql.dataCheckUser, [data.from, extractedDate + "%"]);
          console.log(numSendsToday);

          if (numSendsToday.c > 0) {
            responder.sendSbd(data.amount, dailyLimit);
            return log(chalk.bgYellow.white.bold(`User ${data.from}, reached Daily Limit.. -- Refund --`))
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

  setTimeout(function () {
    log(chalk.bgGreen.white.bold('Bumper Payment Script Online'));
  }, 3000);
  if (Settings.Debug === true) {
    bot.onDeposit('steembust', handleDeposit);
    setTimeout(function () {
      log(chalk.bgYellow.white.bold('Yo Fuckers, Steembust here !'));
    }, 3000);
  } else {
    bot.onDeposit('bumper', handleDeposit);
    setTimeout(function () {
      log(chalk.bgYellow.white.bold('Yo Fuckers, Bumper here !'));
    }, 3000);
  }
  bot.start();
  return

};
