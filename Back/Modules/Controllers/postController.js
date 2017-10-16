class postController
{
    static showIdDetails(req, res)
    {
        res.send("Show id details: " + req.params.id);
    }

    static alterIdDetails(req, res)
    {
        res.send("Alter id details: " + req.params.id);
    }
}

module.exports.postController = postController;