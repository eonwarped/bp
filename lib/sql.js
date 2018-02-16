// Discord Wallet V2.0 Made by Gizmo#5057
// Creator of Curiosity Bot.
// Www.CuriosityDiscord.com

const sql = {

    dataGetInfo: `SELECT * FROM PendingUpvotes WHERE Name = ?`,
    dataGetQueueNames: `SELECT DISTINCT Name FROM PendingUpvotes LIMIT 1000`,
    dataGetLotteryNames: `SELECT DISTINCT Name FROM Lottery LIMIT 1000`,
    
    dataGetUserID: `SELECT * FROM Users WHERE DID = ?`,
    dataGetUserLottery: `SELECT * FROM Lottery ORDER BY RANDOM() LIMIT 3`,

    dataDeleteLottery: `DELETE FROM Lottery`,
    dataInsertUserLottery: `INSERT INTO Lottery (Name, ID) VALUES (?, ?)`,
    dataDeleteUserLottery: `DELETE FROM Lottery WHERE ID = ?`,
    dataDeleteUserLotteryName: `DELETE FROM Lottery WHERE Name = ?`,
    dataInsertUser: `INSERT INTO PendingUpvotes (Name, Amount, Date, Blog) VALUES (?, ?, ?, ?)`,
    dataCheckUser: `SELECT COUNT(*) c FROM PendingUpvotes WHERE Name = ? AND Date LIKE ?`,



    createTablePendingVotes: `CREATE TABLE IF NOT EXISTS PendingUpvotes (Name TEXT, Amount TEXT, Date TEXT, Blog TEXT)`,
    createTableUsers: `CREATE TABLE IF NOT EXISTS Users (Name TEXT, DName TEXT, DID TEXT, Status TEXT)`,
    createTableLottery: `CREATE TABLE IF NOT EXISTS Lottery (Name TEXT, ID TEXT)`,

}

module.exports = sql;
