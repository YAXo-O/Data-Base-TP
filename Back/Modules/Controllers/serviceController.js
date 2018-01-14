const requests = require("../dataBase.js").dbRequests;

class serviceController
{
    static async clear(req, res)
    {
        await requests.purge();

        res.status(200).end();
    }

    static async status(req, res)
    {
        let result = {};

        result.user = +(await requests.usersCount()).count;
        result.forum = +(await requests.forumsCount()).count;
        result.thread = +(await requests.threadsCount()).count;
        result.post = +(await requests.postsCount()).count;

        res.status(200).json(result);
    }
}

module.exports.serviceController = serviceController;