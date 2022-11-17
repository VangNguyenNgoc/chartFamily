const express = require("express");
const router = express.Router();

const NodeController = require("../controllers/NodeController");
const { checkPerson, requireAuth } = require("../middlewares/authen.middle");
router.put("/addNodeChildren/:id", checkPerson, NodeController.addNodeChildren);
router.put("/deleteNode/:id", NodeController.deleteNode);
router.put("/updateNode", NodeController.updateNode);
module.exports = router;
