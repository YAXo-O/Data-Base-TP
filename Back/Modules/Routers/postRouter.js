const express = require("express");
const controller = require("../Controllers/postController.js").postController;
const router = express.Router();

router.get("/:id/details", controller.showIdDetails);

router.post("/:id/details", controller.alterIdDetails);

module.exports.postRouter = router;