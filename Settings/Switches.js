

const Settings = require('./Settings.json');
const X = require('../X.json');


  if (Settings.Debug === true) {
    // // Connection to the STEEM BlockChain.
     const SteemBot = require('steem-bot').default;
     const bot = new SteemBot({username: "steembust", activeKey: Settings.DebugKey});

     if (Settings.Refund === true) {
       //PRE-ORDER CLOSED
       require('../Events/Refund')(bot);
     } else {
       // PRE-ORDER OPEN
       require('../Events/Payments')(bot);
    }
  } else {
    // // Connection to the STEEM BlockChain.
     const SteemBot = require('steem-bot').default;
     const bot = new SteemBot({username: "bumper", activeKey: X.bumper.Active});

     if (Settings.Refund === true) {
       //PRE-ORDER CLOSED
       require('../Events/Refund')(bot);
     } else {
       // PRE-ORDER OPEN
       require('../Events/Payments')(bot);
    }
  }
