const requests = require("../dataBase.js").dbRequests;

class postController
{
    static async showIdDetails(req, res)
    {
        let message = await requests.getPost(req.params.id);
        if(message === null)
        {
            res.status(404).json({message: `Message with id ${req.params.id} isn't found`});

            return;
        }


        let forum = await requests.getForumSlug(message.forum);

        message.forum = forum.slug;
        message.parent = +message.parent;

        let result = {post: message};

        if(req.query.related)
        {
            let keys = req.query.related.split(",");
            for(let i = 0; i < keys.length; i++)
            {
                if(keys[i] === "user")
                    result.author = await requests.getUser(message.author);
                if(keys[i] === "forum")
                {
                    result.forum = await await requests.getForumFullById(forum.id);
                    result.forum.posts = +result.forum.posts;
                    result.forum.user = result.forum.username;
                    delete result.forum.username;
                }
                if(keys[i] === "thread")
                {
                    result.thread = await requests.getThread(message.thread);
                    result.thread.forum = forum.slug;
                }
            }
        }

        res.status(200).json(result);
    }

    static async alterIdDetails(req, res)
    {
        try
        {
            let post = await requests.alterPost(req.params.id, req.body.message);

            res.status(200).json(post);
        }
        catch(err)
        {
            res.status(404).json(err);
        }

    }
}

module.exports.postController = postController;