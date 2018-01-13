const requests = require("../dataBase.js").dbRequests;

class forumController
{
    static async createForum(req, res)
    {
        let user = await requests.getUser(req.body.user);
        if(user === null)
        {
            res.status(404).json({message: `User '${req.body.user}' isn't found!\n`});

            return;
        }

        let forum = await requests.getForum(req.body.slug);
        if(forum !== null)
        {
            forum.user = forum.username;
            delete forum.username;
            res.status(409).json(forum);

            return;
        }

        try
        {
            let result = await requests.createForum({slug: req.body.slug, title: req.body.title, user: req.body.user});
            result.user = req.body.user;

            res.status(201).json(result);
        }
        catch(error)
        {
            let result = await requests.createForum({slug: req.body.slug, title: req.body.title, user: user.nickname});
            result.user = user.nickname;

            res.status(201).json(result);
        }


    }

    static async createSlug(req, res)
    {
        let forum = await requests.getForumId(req.params.slug);
        if(forum === null)
        {
            res.status(404).json({message: `Forum '${req.params.slug}' isn't found!\n`});

            return;
        }
        let user = await requests.getUser(req.body.author);
        if(user === null)
        {
            res.status(404).json({message: `User '${req.body.author}' ins't found!\n`});

            return;
        }

        let thread = await requests.getThread(req.body.slug || req.params.slug);
        if(thread !== null)
        {
            let forumSlug = await requests.getForumSlug(thread.forum);
            thread.forum = forumSlug.slug;
            res.status(409).json(thread);

            return;
        }

        thread = await requests.createThread(req.body.slug || req.params.slug,
                                  {author: req.body.author, forum: forum.id, message: req.body.message,
                                  title: req.body.title, created: req.body.created});

        thread.forum = forum.slug;
        if(req.body.slug === undefined)
            delete thread.slug;

        res.status(201).json(thread);
    }

    static async slugDetails(req, res)
    {
        let forum = await requests.getForumFull(req.params.slug);
        if(forum === null)
        {
            res.status(404).json({message: `Forum '${req.params.slug}' doesn't exist!\n`});

            return;
        }

        forum.user = forum.username;
        delete forum.username;
        forum.posts = +forum.posts;

        res.status(200).json(forum);
    }

    static async slugThreads(req, res)
    {
        let limit = req.query.limit;
        let since = req.query.since;
        let desc = req.query.desc;

        let forum = await requests.getForumId(req.params.slug);
        if(forum === null)
        {
            res.status(404).json({message: `Forum '${req.params.slug}' doesn't exist!\n`});

            return;
        }

        let threads = await requests.getThreads(forum.id, {limit, since, desc});
        threads.forEach((elem) =>
        {
            elem.forum = forum.slug;
        });

        res.status(200).json(threads);
    }

    static async slugUsers(req, res)
    {
        let forum = await requests.getForumId(req.params.slug);
        if(forum === null)
        {
            res.status(404).json({message: `Forum ${req.params.slug} doesn't exist\n`});

            return;
        }

        let users = await requests.getForumUsers(forum.id, {limit: req.query.limit,
            since: req.query.since, desc: req.query.desc});

        res.status(200).json(users);
    }
}

module.exports.forumController = forumController;