const requests = require("../dataBase.js").dbRequests;

class userController
{
    static async create(req, res)
    {
        let users = await requests.getUsers(req.body.email, req.params.nickname);
        if(users.length !== 0)
        {
            res.status(409).json(users);

            return;
        }

        res.status(201).json(await requests.createUser({nickname: req.params.nickname, email: req.body.email,
            fullname: req.body.fullname, about: req.body.about}));
    }

    static async showProfile(req, res)
    {
        let user = await requests.getUser(req.params.nickname);
        if(user === null)
        {
            res.status(404).json({message: `Can't find user with nickname '${req.params.nickname}'\n`});

            return;
        }

        res.status(200).json(user);
    }

    static async alterProfile(req, res)
    {
        let user = await requests.getUser(req.params.nickname);
        if(user === null)
        {
            res.status(404).json({message: `Can't find user with nickname '${req.params.nickname}'\n`});

            return;
        }

        let conflicts = await requests.checkMail(req.params.nickname, req.body.email);
        if(conflicts.length !== 0)
        {
            res.status(409).json({message: `Mail: '${req.email}' is already in use!\n`});

            return;
        }

        if(!req.body.email)
            req.body.email = user.email;
        if(!req.body.fullname)
            req.body.fullname = user.fullname;
        if(!req.body.about)
            req.body.about = user.about;

        res.status(200).json(await requests.changeUser({nickname: req.params.nickname,
            mail: req.body.email, fullname: req.body.fullname, about: req.body.about}));
    }
}

module.exports.userController = userController;