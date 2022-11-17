const express = require("express");
const PersonController = require("../controllers/personController");
const AuthenController = require("../controllers/authenController");
const router = express.Router();

router.post("/login", AuthenController.login);

module.exports = router;
