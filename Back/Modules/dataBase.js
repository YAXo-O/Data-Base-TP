const pgp = require("pg-promise")({});

const connectionData = {
    host: "localhost",
    port: 5432,
    database: "docker",
    user: "docker",
    password: "docker"
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
                                     WHERE id = '${id}'`)
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
        return db.promise.manyOrNone(`SELECT id, author, created, forum, isEdited as "isEdited", 
                                      message, parent, thread
                                      FROM posts
                                      WHERE thread = '${id}'
                                      ${since ? "AND id " + (desc === "true" ? "< " : "> ") + since : ""}
                                      ORDER BY created ${desc === "true" ? "DESC" : "ASC"}, 
                                      id ${desc === "true" ? "DESC" : "ASC"}
                                      ${limit ? "LIMIT " + limit : ""}`);
    }


    static treePosts(id, limit, since, desc)
    {
           return db.promise.manyOrNone(`WITH RECURSIVE r AS
                                        (
                                            SELECT posts.*, ARRAY[id] AS path
                                            FROM posts 
                                            WHERE posts.parent = 0
            
                                            UNION
            
                                            SELECT posts.*, path || posts.id AS path
                                            FROM r JOIN posts on(r.id = posts.parent)
                                        )
        
                                        SELECT * FROM r
                                        WHERE thread = ${id} 
                                        ${since ? "AND path " + (desc === "true" ? "< " : "> ") + 
                                        "(SELECT path FROM r WHERE id = " 
                                        + since + ")" : ""}
                                        ORDER BY path ${desc === "true" ? "DESC" : "ASC"}
                                        ${limit ? "LIMIT " + limit : ""}`
                                        );
    }

    static parentTreePosts(id, limit, since, desc)
    {
        let descStr = desc === "true" ? " DESC " : " ASC ";
        let sign = desc === "true" ? " < " : " > ";
        return db.promise.manyOrNone(`WITH RECURSIVE r AS
                                        (
                                            SELECT posts.*, ARRAY[id] AS path
                                            FROM posts 
                                            WHERE posts.parent = 0
            
                                            UNION
            
                                            SELECT posts.*, path || posts.id AS path
                                            FROM r JOIN posts on(r.id = posts.parent)
                                        )
        
                                        SELECT * FROM r
                                        WHERE thread = ${id}
                                        ${limit ? "AND path[1] in(SELECT id FROM r WHERE parent = 0 AND " +
                                        "thread = " + id + (since ? " AND path " + sign + 
                                        " (SELECT path FROM r WHERE id = "
                                        + since + " AND thread = " + id + " ) " : " ") +
                                        " ORDER BY created " + descStr +
                                        "LIMIT " + limit + ")" : ""}
                                        ORDER BY path ${descStr}`);
    }
    //+ (since ? " AND path > (SELECT path FROM r WHERE id = "
    //+ since + " AND thread = " + id + " ) " : " ") +

    /* Posts */
    static createPosts(posts, slug_id, time)
    {
        return db.promise.task("createTask", async t =>
        {

            let thread = null;
            if(isFinite(slug_id) && Number.isInteger(Number(slug_id)))
                thread = await t.oneOrNone(`SELECT slug, id, forum FROM threads
                                            WHERE id = ${slug_id}`);
            else
                thread = await t.oneOrNone(`SELECT slug, id, forum FROM threads
                                            WHERE LOWER(slug) = LOWER('${slug_id}')`);
            if(thread === null)
                throw  {message: `Post ${slug_id} doesn't exist!\n`, status: 404};

            await t.none(`BEGIN`);

            // Increment forum
            let forum = await t.one(`UPDATE forums SET
                                     posts = posts + ${posts.length} 
                                     WHERE id = ${thread.forum}
                                     RETURNING slug`);

            let result = [];

            for(let i = 0; i < posts.length; i++)
            {
                // Check parent
                if(posts[i].parent && posts[i].parent != 0)
                {
                    let parent = await t.oneOrNone(`SELECT thread FROM posts WHERE id = ${posts[i].parent}`);
                    if(parent === null || parent.thread !== thread.id)
                    {
                        await t.none(`ROLLBACK`);
                        throw {message: `One of posts has parent from another thread!\n`, status: 409};
                    }
                }

                // Check author
                let author = await t.oneOrNone(`SELECT id FROM users 
                                                   WHERE LOWER(nickname) = LOWER('${posts[i].author}')`);
                if(author === null)
                {
                    await t.none(`ROLLBACK`);
                    throw {message: `Author of one of the posts doesn't exist!\n`, status: 404};
                }

                try
                {
                    let insert = "author, created, forum, thread, message" + (posts[i].parent ? ", parent" : "");
                    let values = `'${posts[i].author}', '${posts[i].created || time}', '${thread.forum}',
                               '${thread.id}', '${posts[i].message}'
                               ${posts[i].parent ? ", '" + posts[i].parent + "'" : ""}`;

                    let tmp = await t.one(`INSERT INTO posts(${insert})
                                           VALUES(${values})
                                           RETURNING id, author, created, forum, isEdited as "isEdited", 
                                           message, parent, thread`);
                    tmp.forum = forum.slug;
                    tmp.parent = +tmp.parent;
                    result.push(tmp);
                }
                catch(error)
                {
                    await t.none(`ROLLBACK`);

                    throw {message: `Error while inserting!\n`, status: 409};
                }
            }

            await t.none(`COMMIT`);

            return result;
        });
    }

    static getPost(id)
    {
        return db.promise.oneOrNone(`SELECT id, author, created, forum, message, thread, isEdited as "isEdited"
                                     FROM posts
                                     WHERE id = ${id}`)
    }

    static alterPost(id, message)
    {
        return db.promise.task("alter-post-task", async t =>
        {
            let post = await t.oneOrNone(`SELECT message, forum FROM posts WHERE id = ${id}`);
            if(post == null)
                throw {message: `Post ${id} doesn't exist!\n`};

            let forum = await t.oneOrNone(`SELECT slug FROM forums WHERE id = ${post.forum}`);


            if(post.message === message || message === undefined)
            {
                post = await dbRequests.getPost(id);
                post.forum = forum.slug;

                return post;
            }

            post = await t.one(`UPDATE posts SET
                                message = '${message}',
                                isEdited = true
                                WHERE id = ${id}
                                RETURNING isEdited as "isEdited", id, author, created, forum, message, thread`);
            post.forum = forum.slug;

            return post
        });
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
