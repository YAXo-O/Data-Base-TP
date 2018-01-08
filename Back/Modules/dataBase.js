const pgp = require("pg-promise")({});

const connectionData = {
    host: "localhost",
    port: 5432,
    database: "tp",
    user: "Alex",
    password: "123456"
};

const db = {promise: pgp(connectionData)};

class dbRequests
{
    static getUsers(mail, nickname)
    {
        return db.promise.manyOrNone(`SELECT nickname, email, fullname, about
                                      FROM users WHERE LOWER(nickname) = LOWER('${nickname}')
                                      or LOWER(email) = LOWER('${mail}')`);
    }

    static createUser(info)
    {
        return db.promise.one(`INSERT INTO users(nickname, email, fullname, about)
                               VALUES('${info.nickname}', '${info.email}', '${info.fullname}', '${info.about}') 
                               RETURNING nickname, email, fullname, about`);
    }

    static getUser(nickname)
    {
        return db.promise.oneOrNone(`SELECT nickname, email, fullname, about
                                     FROM users WHERE LOWER(nickname) = LOWER('${nickname}')`);
    }

    static checkMail(nickname, mail)
    {
        return db.promise.manyOrNone(`SELECT nickname, email
                                      FROM users 
                                      WHERE LOWER(nickname) <> LOWER('${nickname}') 
                                      AND LOWER(email) = LOWER('${mail}')`);
    };

    static changeUser(info)
    {
        return db.promise.one(`UPDATE users SET
                               fullname = '${info.fullname}',
                               email = '${info.mail}',
                               about = '${info.about}'
                               WHERE LOWER(nickname) = LOWER('${info.nickname}')
                               RETURNING nickname, email, about, fullname`);
    }
}

module.exports.db = db;
module.exports.dbRequests = dbRequests;