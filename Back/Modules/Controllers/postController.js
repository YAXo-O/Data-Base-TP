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

        /*
        console.log(req.query);
        if(req.query.related)
        {
            if(req.query.related === "user")
                result.author = await requests.getUser(message.author);
            if(req.query.related === "forum")
            {
                result.forum = await await requests.getForumFullById(message.forum);
                result.forum.posts = +result.forum.posts;
            }
            if(req.qeury.related === "thread")
            {
                result.thread = await requests.getThread(message.thread);
                result.thread.forum = forum.slug;
            }
        }
        */

        res.status(200).json(result);
    }

    static async alterIdDetails(req, res)
    {
        try
        {
            let post = await requests.alterPost(req.params.id, req.body.message);
            let forum = await requests.getForumSlug(post.forum);

            post.forum = forum.slug;
            post.parent = +post.parent;

            res.status(200).json(post);
        }
        catch(err)
        {
            res.status(404).json({message: `Can't find message with id ${req.params.id}!\n`});
        }
    }
}

module.exports.postController = postController;