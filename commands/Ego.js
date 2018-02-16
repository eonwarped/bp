// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const Discord = require('discord.js');
const messaging = require('../lib/messaging.js');
const sql = require('../lib/sql.js');
const sqlite = require('sqlite');
const moment = require('moment');
const Req = require('request');

exports.info = {
  enabled: true,
  guild: false,
  name: 'ego',
  aliases: [],
  lvl: 0,
}

const Uber = [
  'The Best,', 'The Mighty,', 'That Wonderful,', 'Uber,', 'Mighty,', 'Sir,',
  'Cute,', 'Furry,', 'Master,', 'The one and only,', 'Sempai,', 'The Holy,'
]

exports.run = async function(client, msg, args) {
  const send = messaging.getSend(msg);
  var QU = (Uber[~~(Math.random() * Uber.length)]);
  var user = args[0];
  var MMU = msg.mentions.users.first();
  if (user) {
    name = user.split('"')
    if (name.length === 1) {
      name = ['', name]
    }
  } else {
    //name = ['Barack', 'Obama']
    name = [QU, `${msg.member.user.username}`] // I'm not sorry b1nzy <3
  }

  Req('http://api.icndb.com/jokes/random?escape=javascript&firstName=' +
    name[0] + '&lastName=' + name[1],
    function(E, R, B) {
      if (!E && R.statusCode === 200) {
        try {
          JSON.parse(B)
        } catch (E) {
          C.send('The API returned an unconventional response.')
          return
        }
        var joke = JSON.parse(B)

        if (MMU) {
          return send(`[ERROR] Do not mention the user ! \nUse only the name please !`);
        }
        send(`${joke.value.joke}`)
      }
    })
};
