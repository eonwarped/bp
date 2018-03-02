const sqlite = require('sqlite');
const steem = require('steem');
const sleep = require('system-sleep');
const settings = require('./Settings/settings.json');

const X = require('./X.json');

const argv = require('yargs').usage('$0 [args]')
.boolean('f')
.describe('f', 'Force votes, Default is false, use prompt [Unsupported for now, always will vote except with dry run]')
.boolean('d')
.describe('d', 'Dry run, Default is false.')
.nargs('n', 1)
.describe('n', 'Limit number of posts, Default is 1000')
.nargs('u', 1)
.describe('u', 'Sets refunds from account.')
.nargs('m', 1)
.describe('m', 'Minimum Vote Power Threshold, Default is 0.8')
.nargs('w', 1)
.describe('w', 'Seconds to wait between voting. Default is 20')
.nargs('v', 1)
.describe('v', 'Voter name.')
.nargs('r', 1)
.describe('r', 'Return. Default is 3 (e.g. 0.5 send -> $1.5 vote)')
.nargs('F', 1)
.describe('F', 'Clause to attach to SQL for debugging purposes')
.help('h')
.argv;

if (!argv.u) {
  argv.u = 'bumper';
}
if (!argv.n) {
  argv.n = 1000;
}
if (!argv.m) {
  argv.m = 0.8;
}
if (!argv.w) {
  argv.w = 20;
}
if (!argv.v) {
  argv.v = 'bumper';
}
if (!argv.r) {
  argv.r = settings.Return;
}
if (!argv.F) {
  argv.F = '';
}
const voterName = argv.v;
const activeUserName = argv.u;
const wif = X[voterName].Posting;
const activeWif = X[activeUserName].Active;

const sqlGetQueueData = 'SELECT * FROM PendingUpvotes WHERE (Processed is null OR Processed != 1) ' + argv.F + ' LIMIT ' + argv.n;
log(sqlGetQueueData);

const voteRegenSeconds = 5*60*60*24; // 5 day
const steemit100Percent = 10000;

// Change the parameter below to desired minimum vote power threshold.
const minPowerThreshold = Number(argv.m) * steemit100Percent;

// Generates time to display in console.
function log(message) {
  console.log(message);
}

function getAmount(v) {
  return Number(v.split(' ')[0]);
}

function formatWeight(v) {
  return v * 100 / steemit100Percent + "%";
}

function extractAuthorFromLink(steemitLink) {
  if (isValidSteemitLink(steemitLink)) {
    const usernamePos = steemitLink.search(/\/@.+\//);
    if (usernamePos === -1) {
      throw new Error("Cannot parse link " + steemitLink);
    }

    const firstPart = steemitLink.slice(usernamePos + 1); // adding 1 to remove the first "/"
    return firstPart.slice(1, firstPart.search('/'));
  }
  throw new Error("Cannot parse link " + steemitLink);
}

/**
 * Should input a full steemit article link and return the permlink of the article
 * @param {string} steemitLink
 */
function extractPermlinkFromLink(steemitLink) {
  if (isValidSteemitLink(steemitLink)) {
    const usernamePos = steemitLink.search(/\/@.+\//);
    if (usernamePos === -1) {
      throw new Error("Cannot parse link " + steemitLink);
    }

    const firstPart = steemitLink.slice(usernamePos + 1); // adding 1 to remove the first "/"
    return firstPart.slice(firstPart.search('/') + 1).replace('/', '').replace('#', '');
  }
  throw new Error("Cannot parse link " + steemitLink);
}

function isValidSteemitLink(link) {
  return link.match(/^https?:\/\/(www\.)?(steemit\.com|busy\.org)\//i);
}

async function fetchGlobalProperties() {
  var prop = {};
  const dgpCall = steem.api.getDynamicGlobalPropertiesAsync();
  const postRewardFundCall = steem.api.getRewardFundAsync('post');
  const feedCall = steem.api.getCurrentMedianHistoryPriceAsync();

  const dgp = await dgpCall;
  log(dgp);
  prop.headBlockTime = dgp.time;
  var powerReserveRate = dgp.vote_power_reserve_rate;
  prop.maxVoteDenom = powerReserveRate * voteRegenSeconds / (60*60*24);

  const postRewardFund = await postRewardFundCall;
  log(postRewardFund);
  prop.recentClaims = postRewardFund.recent_claims;
  log(prop.recentClaims);
  prop.rewardBalance = getAmount(postRewardFund.reward_balance);
  log(prop.rewardBalance);

  const feedPrice = await feedCall;
  log(feedPrice);
  prop.feedPrice = getAmount(feedPrice.base);
  return prop;
}

async function fetchVoterProperties(prop) {
  const accounts = await steem.api.getAccountsAsync([voterName]);
  const account = accounts[0];
  const voter = {}
  const elapsedSec = (Date.parse(prop.headBlockTime) - Date.parse(account.last_vote_time))/1000;
  const regenPower = (steemit100Percent * elapsedSec) / voteRegenSeconds;
  voter.power = Math.min(account.voting_power + regenPower, steemit100Percent);

  // Testing current weight
  const weight = steemit100Percent;

  var usedPower = voter.power * weight / steemit100Percent;
  usedPower = (usedPower + prop.maxVoteDenom - 1) / prop.maxVoteDenom;

  voter.effectiveVestingShares = getAmount(account.vesting_shares) - getAmount(account.delegated_vesting_shares) + getAmount(account.received_vesting_shares);

  const absRshares = voter.effectiveVestingShares * usedPower / steemit100Percent;
  log("Current voting value: " + absRshares * 1000000 * prop.rewardBalance * prop.feedPrice / prop.recentClaims);
  return voter;
}

async function refundUser(targetUser, sendAmount, memo) {
  if (argv.d) {
      log("[Dry run] Would have refunded " + targetUser + " " + sendAmount + " SBD with memo " + memo);
  } else {
    await steem.broadcast.transferAsync(
      activeWif,
      activeUserName,
      targetUser,
      sendAmount,
      memo
    );
  }
}

function shouldRefundRow(row) {
  if (row.Plagiarized === 1) {
    return 'is plagiarized or of low quality';
  }
}

async function markPendingRowProcessed(targetUser, targetPermLink) {
  if (argv.d) {
    log("[Dry run] Would have marked entry " + targetUser + "," + targetPermLink + " as processed.");
  } else {
    await sqlite.run(`UPDATE PendingUpvotes SET Processed = 1 WHERE Name = ? AND Blog = ?`, [targetUser, targetPermLink]);
    log("Marked entry " + targetUser + "," + targetPermLink + " as processed.");
  }
}

async function voteAndUpdateWeight(prop, voter, row) {
  const targetUser = row.Name;
  const targetPermLink = row.Blog;
  const sendAmount = row.Amount;
  const sbdValue = getAmount(sendAmount) * argv.r;

  const refundReason = shouldRefundRow(row);
  if (refundReason) {
    await refundUser(targetUser, sendAmount, `Bumper Refund: Post ${refundReason}. ${targetPermLink}`);
    await markPendingRowProcessed(targetUser, targetPermLink);
    return;
  }

  const currentPower = voter.power;
  log("Power before vote: " + formatWeight(currentPower));
  // lets reverse formula now.
  // sbdValue = effectiveVestingShares * usedPower * 1000000 * rewardBalance * feedPrice / (recentClaims * steemit100Percent)
  const usedPower = sbdValue * prop.recentClaims * steemit100Percent / (voter.effectiveVestingShares * 1000000 * prop.rewardBalance * prop.feedPrice);

  if (voter.power < usedPower) {
    throw new Error("Cannot make target. Not enough power.");
  }

  // usedPower = (power * weight / steemit100Percent + maxVoteDenom - 1) / maxVoteDenom
  var weight = Math.floor((usedPower * prop.maxVoteDenom + 1 - prop.maxVoteDenom) * steemit100Percent / currentPower);
  if (weight <= 0) {
    throw new Error("Cannot make target. Assigned weight negative, target vote value too low.");
  }
  if (weight > steemit100Percent) {
    throw new Error("Cannot make target. Exceeds max possible value of vote.");
  }

  const authorToVote = extractAuthorFromLink(targetPermLink);
  const permlinkToVote = extractPermlinkFromLink(targetPermLink);

  // Fetch vote content
  const post = await steem.api.getContentAsync(authorToVote, permlinkToVote);
  const postAgeMillis = Date.now() - Date.parse(post.created);
  if (postAgeMillis > 6.5 * 24 * 60 * 60 * 1000) {
    log("Post too old, Age in days: " + postAgeMillis / (24 * 60 * 60 * 1000));
    await refundUser(targetUser, sendAmount, `Bumper Refund: Post is too old. ${targetPermLink}`);
    await markPendingRowProcessed(targetUser, targetPermLink);
    return;
  }

  if (argv.d) {
    log("[Dry run] Would have voted " + authorToVote + " post at " + permlinkToVote + " with weight " + weight + "/10000 and expected value $" + sbdValue);
  } else {
    await steem.broadcast.voteAsync(
      wif,
      voterName,
      authorToVote,
      permlinkToVote,
      weight
    );
    log("Voted " + authorToVote + " post at " + permlinkToVote + " with weight " + weight + "/10000 and expected value $" + sbdValue);
  }
  await markPendingRowProcessed(targetUser, targetPermLink);

  voter.power = voter.power - usedPower;

  // regen
  var regenPower = (steemit100Percent * argv.w) / voteRegenSeconds;
  voter.power = Math.min(voter.power + regenPower, steemit100Percent);
  log("Power after vote, after " + argv.w + " seconds regen: " + formatWeight(voter.power));

  if (voter.power < minPowerThreshold) {
    throw new Error("Voting Power below threshold. Stopping.");
  }

  return weight;
}

async function voteOnQueue(prop, voter) {
  log("Fetching entries to vote on");
  await sqlite.open(`./db.sqlite`);

  const rows = await sqlite.all(sqlGetQueueData);
  for (var i=0; i < rows.length; i++) {
    row = rows[i];
    log(row);
    log("");
    log("###########");
    log("User: " + row.Name);
    log("Amount: " + row.Amount);
    log("Blog: " + row.Blog);
    var weight = await voteAndUpdateWeight(prop, voter, row);
    log("Weight to use: " + formatWeight(weight));
    log("Waiting " + argv.w + " seconds...");
    sleep(argv.w*1000);
  }
}

async function main() {
  log("Fetching global properties");
  const prop = await fetchGlobalProperties();
  log(prop);
  log("Fetching voter properties");
  const voter = await fetchVoterProperties(prop);
  log(voter);
  voteOnQueue(prop, voter);
}

main();
