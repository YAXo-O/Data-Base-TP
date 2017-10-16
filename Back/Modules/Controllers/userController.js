class userController
{
    static create(req, res)
    {
        res.send("Create: " + req.params.nickname);
    }

    static showProfile(req, res)
    {
        res.send("Show profile: " + req.params.nickname);
    }

    static alterProfile(req, res)
    {
        res.send("Alter profile: " + req.params.nickname);
    }
}

module.exports.userController = userController;