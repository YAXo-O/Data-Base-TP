const pgp = require("pg-promise")({});

const connectionData = {
    host: "localhost",
    port: 5432,
    database: "tp",
    user: "Alex",
    password: "123456"
};

const db = {promise: pgp(connectionData)};

module.exports.db = db;