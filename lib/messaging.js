const log = require('./log.js').log;

module.exports = {
  getSend: (msg) => {
      const chan = msg.channel;
      const randomTime = 3000;
      return (message, deleteAfter, embedded = true, color = 'css') => {
          const embed = '```'+color+'\n'+message+'```';
          if (deleteAfter) {
              chan.startTyping();
                setTimeout(function () {
                  chan.stopTyping();
                  chan.send(embedded?embed:message).then(msg => {
                      msg.delete(30000);
                  }).catch(console.error)
                }, randomTime);
          } else {
              chan.startTyping();
              setTimeout(function () {
                chan.stopTyping();
                chan.send(embedded?embed:message);
              }, randomTime);
          }
          chan.stopTyping();
      }
      chan.stopTyping();
  }
};
