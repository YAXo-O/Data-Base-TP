const db = require("../dataBase.js");

class forumController
{
    static createForum(req, res)
    {
        const body = req.body;
        console.log(body);

        res.send("Forum create");
    }

    static createSlug(req, res)
    {
        res.send("Slug create: " + req.params.slug);
    }

    static slugDetails(req, res)
    {
        res.send("Slug details: " + req.params.slug);
    }

    static slugThreads(req, res)
    {
        res.send("Slug treads: " + req.params.slug);
    }

    static slugUsers(req, res)
    {
        res.send("Slug users: " + req.params.slug);
    }
}

module.exports.forumController = forumController;