const requests = require("../dataBase.js").dbRequests;


class threadController
{
    static async threadCreate(req, res)
    {
        let time = (new Date()).toISOString();// Magic for exact time

        let result = null;
        try
        {
            result = await requests.createPosts(req.body, req.params.slug_id, time);
        }
        catch(error)
        {
            res.status(error.status).json({message: error.message});

            return;
        }


        res.status(201).json(result);
    }

    static async threadShowDetails(req, res)
    {
        let thread = await requests.getThread(req.params.slug_id);
        if(thread === null)
        {
            res.status(404).json({message: `Thread ${req.params.slug_id} isn't found!\n`});

            return;
        }
        let forum = await requests.getForumSlug(thread.forum);
        thread.forum = forum.slug;

        res.status(200).json(thread);
    }

    static async threadAlterDetails(req, res)
    {
        let thread = await requests.getThread(req.params.slug_id);
        if(thread === null)
        {
            res.status(404).json({message: `Thread ${req.params.slug_id} isn't found!\n`});

            return;
        }

        let forum = await requests.getForumSlug(thread.forum);
        if(req.body.title === undefined && req.body.message === undefined)
        {
            thread.forum = forum.slug;
            res.status(200).json(thread);

            return;
        }

        thread = await requests.alterThread(thread.id, {message: req.body.message, title: req.body.title});
        thread.forum = forum.slug;

        res.status(200).json(thread);
    }

    static async threadPosts(req, res)
    {
        let thread = await requests.getThread(req.params.slug_id);
        if(thread === null)
        {
            res.status(404).json({message: `Thread ${req.params.slug_id} isn't found!\n`});

            return;
        }

        let forum = await requests.getForumSlug(thread.forum);
        let posts = [];
        switch(req.query.sort)
        {
            case "flat":
                posts = await requests.flatPosts(thread.id, req.query.limit, req.query.since, req.query.desc);
                break;

            case "tree":
                break;

            case "parent_tree":
                break;

            default:
                res.status(200).json(posts);
        }

        posts.forEach((elem) =>
        {
            elem.forum = forum.slug;
            elem.parent = +elem.parent;
        });

        res.status(200).json(posts);
    }

    static async threadVote(req, res)
    {
        let thread = await requests.getThread(req.params.slug_id);
        if(thread === null)
        {
            res.status(404).json({message: `Thread ${req.params.slug} isn't found!\n`});

            return;
        }
        let user = await requests.getUser(req.body.nickname);
        if(user === null)
        {
            res.status(404).json({message: `User ${req.body.nickname} isn't found!\n`});

            return;
        }

        let forum = await requests.getForumSlug(thread.forum);

        let voice = await requests.getVoice(req.body.nickname, thread.id);
        if(voice === null)
        {
            await requests.createVoice(req.body.nickname, thread.id, req.body.voice);
            let voices = await requests.voiceForThread(thread.id);
            thread = await requests.alterThreadVoice(thread.id, voices.sum);
            thread.forum = forum.slug;

            res.status(200).json(thread);

            return ;
        }
        await requests.changeVoice(req.body.nickname, thread.id, req.body.voice);
        let voices = await requests.voiceForThread(thread.id);
        thread = await requests.alterThreadVoice(thread.id, voices.sum);
        thread.forum = forum.slug;
        res.status(200).json(thread);
    }
}

module.exports.threadController = threadController;