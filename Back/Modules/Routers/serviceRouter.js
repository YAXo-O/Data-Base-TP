const express = require("express");
const router = express.Router();

router.post("/clear", function(req, res)
{
    res.send("Post clear");
});

router.get("/status", function(req, res)
{
    res.send("Get status");
});

module.exports.serviceRouter = router;