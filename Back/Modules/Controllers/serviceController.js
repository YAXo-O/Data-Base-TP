class serviceController
{
    static clear(req, res)
    {
        res.send("Clear");
    }

    static status(req, res)
    {
        res.send("Status");
    }
}

module.exports.serviceController = serviceController;