




const X = require('../X.json');
const strings = {

  giveHelp: ()=> {
    return `
--------------------------------------
[ Dubble your investment with Bumper! ]
--------------------------------------
We will upvote your post with double the
amount of SBD you send to us ! Currently
our limit is ${X.Settings.MaxPrice} SBD per blog.
--------------------------------------
NOTE: Votes are done manually right now !
--------------------------------------`
},

  giveGuidance: ()=> {
    return `
-------------------------------------------------
[ Send 0.1 / 0.5 SBD to @Bumper With Blog Link! ]
-------------------------------------------------`
  }

}


module.exports = strings;
