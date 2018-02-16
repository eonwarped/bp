// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const strings = require('../strings/data.js');
const decimal = require('../lib/math.js').decimal;

exports.info = {
  enabled: true,
  guild: false,
  name: 'data',
  aliases: [],
  lvl: 0,
}

exports.run = async function(client, msg, args) {
  const mct = msg.content.toLowerCase();
  const send = messaging.getSend(msg);
  const steem = require('steem');
  const type = args[0];
  const acc = args[1];
  const afterTag = args[1];

 steem.api.setOptions({ url: 'wss://steemd-int.steemit.com' });

//   send(`
// -------------------------
// [ ${acc} ]
// -------------------------
// Following [ ${follower} ] Accounts
// Followed By [ ${following} ] Accounts
// -------------------------
// `)

  try {

    if (type === 'delegation' || type === 'dele') {
      var account = args[1];
      var from = args[2];
      if (!account) return send(strings.dataErrorDelegator(), true, true, 'css');
      if (!from) return send(strings.dataErrorDelegatee(), true, true, 'css')
      steem.api.getVestingDelegations(account, from, 10, function(err, res) {
        console.log(res);
        if (!res[0]) return send(strings.dataErrorNoDelegations(account, from))
        if (res[0]) {
          delegator = res[0]['delegator'];
          delegatee = res[0]['delegatee'];
          shares    = res[0]['vesting_shares'];
          time      = res[0]['min_delegation_time'];

        var clock = moment(time).format('YY MM DD hh:mm a');
        var amount = decimal(parseFloat(shares), -3);

          return send(`
-----------------------------------
Account Name  = [ ${delegator} ]
Has Delegated = [ ${amount} VESTS ]
To Account    = [ ${delegatee} ]
-----------------------------------
     Start Delegation Time
      [${clock}]
-----------------------------------
`)
        }
      });
}


    if (type === "createkey") {
      var password = steem.formatter.createSuggestedPassword();
      send(`Random Generated Password ! [ ${password} ]`)
    }

    if (type === 'follow') {
      steem.api.getFollowCount(acc, function(err, res) {
        if (err) console.log(err);
        send(`
-------------------------
      [ ${acc} ]
-------------------------
Following [ ${res.following_count} ] Accounts
Followed By [ ${res.follower_count} ] Accounts
-------------------------
`)
      });
    }


    if (type === 'activewitness') {
      steem.api.getActiveWitnesses(function(err, res) {
         var output = res.join(" \n");
         send(strings.dataActiveWitness(output));
      });
    }



    if (!type) return send(strings.dataExplination(), true, true, 'css');

    if (type === 'tag') {
    if (!afterTag) return send(strings.dataErrorTag(), true, true, 'css');
    steem.api.getTrendingTags(afterTag, 10, function(err, res) {

        if(res[0]) {
          name = res[0]['name']
          votes = res[0]['net_votes']
          top = res[0]['top_posts']
          comment = res[0]['comments']
          payout = res[0]['total_payouts']



          return send(`
Tag = [ ${name} ]
Total [ ${votes} ] Votes on posts
Total [ ${comment} ] comment on these posts
Total [ ${top} ] post hit the trendings
Total [ ${payout} ] was colleded on this tag
`)

        }
    });
    }

    if (type === 'user') {
      if (!acc) return send(strings.dataErrorNoAcc(), true, true, 'css');
    steem.api.getAccounts([acc], function (err, res) {
    // console.log(res);
    if(err) return console.log(err);
    if(res[0]) {
      name       = res[0]['name']
      vote       = res[0]['can_vote']
      update     = res[0]['last_owner_update']
      postCount  = res[0]['post_count']
      lastPost   = res[0]['last_post']
      vp         = res[0]['voting_power']
      wVotesC    = res[0]['witnesses_voted_for']
      wVotes     = res[0]['witness_votes']
      sbd        = res[0]['sbd_balance']
      balance    = res[0]['balance']
      savings    = res[0]['savings_sbd_balance']
      delegated  = res[0]['delegated_vesting_shares']
      delegation = res[0]['received_vesting_shares']
      lastVote   = res[0]['last_vote_time']
      reputation = res[0]['reputation']

      var date = moment(update).format('DD MMM YY hh:mm a');
      var lvDate = moment(lastVote).format('DD MMM YY hh:mm a');
      var lPost = moment(lastPost).format('DD MMM YY hh:mm a');
      var calcDelegate = parseFloat(delegated).toFixed(3);
      var calcDelegation = parseFloat(delegation).toFixed(3);
      var calcVP = decimal(parseFloat(vp / 100), -2);
      var Rep = steem.formatter.reputation(reputation);

      return send(`
-------------------------------------------
    STEEM BLOCKCHAIN ACCOUNT DATA
-------------------------------------------
Steemit Account  = [ ${name} ]
Reputation       = [ ${Rep} ]
Can User Vote ?  = [ ${vote} ]
Voting Power     = [ ${calcVP}% ]
Total Post Count = [ ${postCount} ]
------------------------
//-- Recent Activities:
------------------------
Users Last Acitivity = [ ${date} ]
Users Last Post      = [ ${lPost} ]
Users Last Voted     = [ ${lvDate} ]
------------------------
//-- Users Wallet
------------------------
Balance SBD   = [ ${sbd} ]
Balance STEEM = [ ${balance} ]
Savings SBD   = [ ${savings} ]
Delegated     = [ ${calcDelegate} VESTS]
Delegation    = [ ${calcDelegation} VESTS]
------------------------
//-- Users Witness Votes
------------------------
Total Votes Casted = [ ${wVotesC} ]
------------------------
[ ${wVotes.join(" -- ")} ]
-------------------------------------------
             END THE MESSAGE
-------------------------------------------
`)
    };

    });
    }


  } catch (e) {
    console.log(e);
    send(e.message);
  }

}
