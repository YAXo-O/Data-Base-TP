const express = require("express");
const controller = require("../Controllers/threadController.js").threadController;
const router = express.Router();

router.post("/:slug_id/create", controller.threadCreate);

router.get("/:slug_id/details", controller.threadShowDetails);

router.post("/:slug_id/details", controller.threadAlterDetails);

router.get("/:slug_id/posts", controller.threadPosts);

router.post("/:slug_id/vote", controller.threadVote);

module.exports.threadRouter = router;