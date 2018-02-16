
const moment = require('moment');
const chalk = require('chalk');
const loglevel = 10;

module.exports={
    log : (msg, params, level = 1) => {
        if(loglevel >= level) {
            if(params) console.error(`[${moment().format('YYYY-MM-DD HH:MM:SS')}]`, msg, params);
            else console.error(`[${moment().format('YYYY-MM-DD HH:MM:SS')}]`, msg);
        }
    },
    logCommand: (msg, command) => {
        (
            chalk.bgBlue.white.bold(`User: ${msg.member.user.username}#${msg.member.user.discriminator} `) +
            chalk.bgBlue.white(`Guild: ${msg.member.guild.name} - Used: `) +
            chalk.bgMagenta.white(command)
        )
    },
    handleError: (e) => {
        console.error(`ERROR [${moment().format('YYYY-MM-DD HH:MM:SS')}]`, e);
    }
};
