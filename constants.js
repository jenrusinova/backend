//Database
const host = process.env.host || "localhost";
const dbPort = process.env.dbPort || "27017";
const database = process.env.db || "petpics";

//Server
const serverPort = process.env.serverPort || "3000";

module.exports = { host, dbPort, database, serverPort };
