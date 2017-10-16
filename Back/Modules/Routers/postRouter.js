const express = require("express");
const router = express.Router();

router.get("/:id/details", function(req, res)
{
   res.send("Get details: " + req.params.id);
});

router.post("/:id/details", function(req, res)
{
    res.send("Post details: " + req.params.id);
});

module.exports.postRouter = router;