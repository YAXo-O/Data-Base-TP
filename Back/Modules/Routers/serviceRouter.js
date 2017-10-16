const express = require("express");
const controller = require("../Controllers/serviceController.js").serviceController;
const router = express.Router();

router.post("/clear", controller.clear);

router.get("/status", controller.status);

module.exports.serviceRouter = router;