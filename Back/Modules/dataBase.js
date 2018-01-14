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
    /* Users */
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

    static getUserId(nickname)
    {
        return db.promise.oneOrNone(`SELECT id
                                     FROM users
                                     WHERE nickname = '${nickname}'`);
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

    static getForumUsers(forum_id, info)
    {
        return db.promise.manyOrNone(`
SELECT users.email, users.fullname, users.nickname, users.about
FROM threads FULL JOIN users ON(threads.author = users.nickname) FULL JOIN posts ON(users.nickname = posts.author)
WHERE (threads.forum = ${forum_id} OR posts.forum = ${forum_id}) ${info.since ? "AND users.nickname " + 
            (info.desc === "true" ? "<" : ">") + " '" + info.since + "'" : ""}
GROUP BY users.id
ORDER BY LOWER(users.nickname) ${info.desc === "true" ? "DESC" : "ASC"}
${info.limit ? "LIMIT " + info.limit : ""}`);
    }

    /* Forum */
    static getForum(slug)
    {
        return db.promise.oneOrNone(`SELECT slug, title, username
                                     FROM forums
                                     WHERE LOWER(slug) = LOWER('${slug}')`);
    }

    static getForumId(slug)
    {
        return db.promise.oneOrNone(`SELECT id, slug
                                     FROM forums
                                     WHERE LOWER(slug) = LOWER('${slug}')`);
    }

    static getForumSlug(id)
    {
        return db.promise.oneOrNone(`SELECT id, slug
                                     FROM forums
                                     WHERE id = ${id}`);
    }

    static getForumFull(slug)
    {
        return db.promise.oneOrNone(`SELECT * 
                                     FROM forums
                                     WHERE LOWER(slug) = LOWER('${slug}')`);
    }

    static getForumFullById(id)
    {
        return db.promise.oneOrNone(`SELECT *
                                     FROM forums
                                     WHERE id = ${id}`)
    }

    static createForum(info)
    {
        return db.promise.one(`INSERT INTO forums(slug, title, username)
                               VALUES('${info.slug}', '${info.title}', '${info.user}')
                               RETURNING slug, title`);
    }

    static incrementThread(id)
    {
        return db.promise.none(`UPDATE forums SET
                                threads = threads + 1
                                WHERE id = '${id}'`);
    }

    static incrementPost(id, count)
    {
        return db.promise.one(`UPDATE forums SET
                               posts = posts + ${count}
                               WHERE id = '${id}'
                               RETURNING slug`);
    }

    /* Threads */
    static async createThread(slug, info)
    {
        await dbRequests.incrementThread(info.forum);
        if(info.created === undefined)
            return db.promise.one(`INSERT INTO threads(author, forum, message, slug, title)
                                   VALUES('${info.author}', '${info.forum}', 
                                   '${info.message}', '${slug}', '${info.title}')
                                   RETURNING author, forum, id, message, slug, title`);

        return db.promise.one(`INSERT INTO threads(author, created, forum, message, slug, title)
                               VALUES('${info.author}', '${info.created}', '${info.forum}', 
                               '${info.message}', '${slug}', '${info.title}')
                               RETURNING author, created, forum, id, message, title, slug`);
    }

    static getThreads(id, info)
    {
        return db.promise.manyOrNone(`SELECT *
                                      FROM threads
                                      WHERE forum = '${id}' 
                                      ${info.since ? "AND created" + (info.desc === "true" ? " <= " : " >= ")
                                      + "'" + info.since + "'" : ""}
                                      ORDER BY created ${info.desc === "true" ? "DESC" : "ASC"}
                                      ${info.limit ? "LIMIT " + info.limit : ""}`);
    }

    static getThread(slug_id)
    {
        if(isFinite(slug_id) && Number.isInteger(Number(slug_id)))
            return db.promise.oneOrNone(`SELECT * FROM threads
                                         WHERE id = ${slug_id}`);
        return db.promise.oneOrNone(`SELECT * FROM threads
                                     WHERE LOWER(slug) = LOWER('${slug_id}')`);
    }

    static getThreadSlug(id)
    {
        return db.promise.oneOrNone(`SELECT slug FROM threads WHERE id = ${id}`)
    }

    static alterThread(id, info)
    {
        return db.promise.one(`UPDATE threads SET
                               ${info.title ? "title = " + "'" + info.title + "'" : ""}
                               ${info.title && info.message ? "," : ""}
                               ${info.message ? "message = " + "'" + info.message + "'" : ""}
                               WHERE id = '${id}'
                               RETURNING *`);
    }

    static alterThreadVoice(id, voice)
    {
        return db.promise.oneOrNone(`UPDATE threads SET
                                     votes = '${voice}'
                                     WHERE id = '${id}'
                                     RETURNING *`);
    }

    static getVoice(user, thread)
    {
        return db.promise.oneOrNone(`SELECT id, voice
                                     FROM votes
                                     WHERE LOWER(voterNickname) = LOWER('${user}')
                                     AND voiceThread = ${thread}`);
    }

    static createVoice(nickname, thread, voice)
    {
        return db.promise.none(`INSERT INTO votes(voterNickname, voice, voiceThread)
                               VALUES('${nickname}', ${voice}, '${thread}')`);
    }

    static voiceForThread(thread)
    {
        return db.promise.one(`SELECT SUM(voice) FROM votes WHERE voiceThread = ${thread}`)
    }

    static changeVoice(nickname, thread, voice)
    {
        return db.promise.none(`UPDATE votes SET
                               voice = '${voice}'
                               WHERE LOWER(voterNickname) = LOWER('${nickname}')
                               AND voiceThread = ${thread}`)
    }

    static flatPosts(id, limit, since, desc)
    {
        return db.promise.manyOrNone(`SELECT * FROM posts
                                      WHERE thread = '${id}'
                                      ${since ? "AND id > " + since : ""}
                                      ORDER BY created ${desc ? "DESC" : "ASC"}, id ${desc ? "DESC" : "ASC"}
                                      ${limit ? "LIMIT " + limit : ""}`);
    }

    /* Posts */
    static createPost(post, forum, thread, time)
    {
        return db.promise.one(`INSERT INTO posts(author, message, ${post.parent ? "parent," : ""} forum, thread 
                               ${time ? ", created" : ""})
                               VALUES('${post.author}', '${post.message}',
                               ${post.parent ? post.parent + "," : ""} '${forum}', '${thread}' 
                               ${time ? ", '" + time + "'" : ""})
                               RETURNING author, id, isEdited, message, thread, created`);
        //to_char(created, 'YYYY-MM-DD"T"HH24:MI:SS.MSOF:00')
    }

    static getPost(id)
    {
        return db.promise.oneOrNone(`SELECT *
                                     FROM posts
                                     WHERE id = ${id}`)
    }

    static alterPost(id, message)
    {
        return db.promise.one(`UPDATE posts SET
                               message = '${message}',
                               isEdited = true
                               WHERE id = ${id}
                               RETURNING *`);
    }

    static checkParent(post, thread)
    {
        return db.promise.oneOrNone(`SELECT COUNT(*)
                                     FROM posts
                                     WHERE id = ${post.parent} AND thread = ${thread}`);
    }

    /* Services */
    static purge()
    {
        return db.promise.none(`TRUNCATE users CASCADE`);
    }

    static forumsCount()
    {
        return db.promise.one(`SELECT COUNT(*)
                       FROM forums`)
    }

    static threadsCount()
    {
        return db.promise.one(`SELECT COUNT(*)
                       FROM threads`);
    }

    static postsCount()
    {
        return db.promise.one(`SELECT COUNT(*)
                       FROM posts`);
    }

    static usersCount()
    {
        return db.promise.one(`SELECT COUNT(*)
                       FROM users`)
    }

}

module.exports.db = db;
module.exports.dbRequests = dbRequests;