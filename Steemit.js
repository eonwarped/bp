

const X = require('./X.json');


  if (X.Settings.Debug === true) {
    // // Connection to the STEEM BlockChain.
     const SteemBot = require('steem-bot').default;
     const bot = new SteemBot({username: "steembust", activeKey: X.buster.Debug});
     console.log(`DEBUNKING  !!!!!`);
     console.log(`DEBUNKING  !!!!!`);
     console.log(`DEBUNKING  !!!!!`);
     console.log(`DEBUNKING  !!!!!`);

     if (X.Settings.Refund === true) {
       //PRE-ORDER CLOSED
       require('./events/Refund')(bot);
     } else {
       // PRE-ORDER OPEN
       require('./events/Upvoter')(bot);
    }
  } else {
    // // Connection to the STEEM BlockChain.
     const SteemBot = require('steem-bot').default;
     const bot = new SteemBot({username: "bumper", activeKey: X.bumper.Active});

     if (X.Settings.Refund === true) {
       //PRE-ORDER CLOSED
       require('./events/Refund')(bot);
     } else {
       // PRE-ORDER OPEN
       require('./events/Upvoter')(bot);
    }
  }
