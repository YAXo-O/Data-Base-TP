const express = require("express");
const controller = require("../Controllers/forumController.js").forumController;
const router = express.Router();

router.post("/create", controller.createForum);

router.post("/:slug/create", controller.createSlug);

router.get("/:slug/details", controller.slugDetails);

router.get("/:slug/threads", controller.slugThreads);

router.get("/:slug/users", controller.slugUsers);

module.exports.forumRouter = router;