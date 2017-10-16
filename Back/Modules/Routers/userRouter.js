const express = require("express");
const controller = require("../Controllers/userController.js").userController;
const router = express.Router();

router.post("/:nickname/create", controller.create);

router.get("/:nickname/profile", controller.showProfile);

router.post("/:nickname/profile", controller.alterProfile)

module.exports.userRouter = router;