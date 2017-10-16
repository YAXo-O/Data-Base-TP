const express = require("express");
const router = express.Router();

router.post("/:nickname/create", function(req, res)
{
    res.send("Post create: " + req.params.nickname);
});

router.get("/:nickname/profile", function(req, res)
{
    res.send("Get profile: " + req.params.nickname);
});

router.post("/:nickname/profile", function(req, res)
{
    res.send("Post profile: " + req.params.nickname);
})

module.exports.userRouter = router;