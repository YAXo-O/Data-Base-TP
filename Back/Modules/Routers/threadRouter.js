const express = require("express");
const router = express.Router();

router.post("/:slug_id/create", function(req, res)
{
    res.send("Post create thread: " + req.params.slug_id);
});

router.get("/:slug_id/details", function(req, res)
{
    res.send("Get slug/id details: " + req.params.slug_id);
});

router.post("/:slug_id/details", function(req, res)
{
    res.send("Post slug/id details: " + req.params.slug_id);
});

router.get("/:slug_id/posts", function(req, res)
{
    res.send("Get slug/id posts: " + req.params.slug_id);
});

router.post("/:slug_id/vote", function(req, res)
{
    res.send("Post slug_id vote: " + req.params.slug_id);
})

module.exports.threadRouter = router;