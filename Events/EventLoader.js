
// Curiosity V.2.0 Made by Gizmo#5057
// Http://wwwCuriosityBot.TK
const reqEvent = ( event ) =>
  require(`../Events/${event}`)

module.exports = (client, golosBot) => {
  client.on('ready', () => reqEvent('Ready')(client));
  client.on('message', reqEvent('Message'));
};
