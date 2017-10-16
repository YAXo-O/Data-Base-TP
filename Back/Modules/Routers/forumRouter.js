const express = require("express");
const router = express.Router();

router.post("/create", function(req, res, nxt)
{
    res.send("Post-create");
});

router.post("/:slug/create", function(req, res)
{
    res.send("Post branch create: " + req.params.slug);
});

router.get("/:slug/details", function(req, res)
{
    res.send("Get details: " + req.params.slug);
});

router.get("/:slug/threads", function(req, res)
{
    res.send("Get threads: " + req.params.slug);
});

router.get("/:slug/users", function(req, res)
{
    res.send("Get users: " + req.params.slug);
});

module.exports.forumRouter = router;