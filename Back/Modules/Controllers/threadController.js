const requests = require("../dataBase.js").dbRequests;


class threadController
{
    static async threadCreate(req, res)
    {
        let time = (new Date()).toISOString();// Magic for exact time

        let thread = await requests.getThread(req.params.slug_id);
        if(thread === null)
        {
            res.status(404).json({message: `Thread ${req.params.slug_id} isn't found!`});
            return;

        }

        let forum = await requests.incrementPost(thread.forum, req.body.length);
        let created = [];
        for(let i = 0; i < req.body.length; i++)
        {
            let result = await requests.createPost(req.body[i], thread.forum, thread.id, time);
            if(req.body[i].parent)
                result.parent = req.body[i].parent;
            result.forum = forum.slug;

            result.created = time;

            created.push(result);
        }

        res.status(201).json(created);
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

        thread = await requests.alterThread(thread.id, {message: req.body.message, title: req.body.title});
        let forum = await requests.getForumSlug(thread.forum);
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
            res.status(404).json({message: `Thread ${req.params.slug} isn't found`});

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