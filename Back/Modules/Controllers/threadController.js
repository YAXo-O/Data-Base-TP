class threadController
{
    static threadCreate(req, res)
    {
        res.send("Thread created: " + req.params.slug_id);
    }

    static threadShowDetails(req, res)
    {
        res.send("Thread show details: " + req.params.slug_id);
    }

    static threadAlterDetails(req, res)
    {
        res.send("Thread alter details: " + req.params.slug_id);
    }

    static threadPosts(req, res)
    {
        res.send("Thread posts: " + req.params.slug_id);
    }

    static threadVote(req, res)
    {
        res.send("Thread vote: " + req.params.slug_id);
    }
}

module.exports.threadController = threadController;