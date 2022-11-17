const express = require("express");
const PersonController = require("../controllers/personController");
const upload = require("../middlewares/multer.middle");
const { checkPerson, requireAuth } = require("../middlewares/authen.middle");
const router = express.Router();
router.post(
  "/create",
  upload.single("formAddImage"),
  PersonController.createPerson
);

router.get("/getall", checkPerson, PersonController.getAllPerson);
router.get("/getnotchildren", PersonController.getPersonNotChild);
router.get("/getbyname", PersonController.getPersonByName);
router.delete("/delete/:id", PersonController.deletePerson);
router.put(
  "/update/:id",
  upload.single("formUpdateImage"),
  PersonController.updatePerson
);

router.get("/getdatafromnode/:id", PersonController.getDataFromNode);
router.get("/getdatabyid/:id", PersonController.getPersonById);
router.get(
  "/getdatacanwedding",
  checkPerson,
  PersonController.listPersonCanWedding
);
router.post("/wedding/:id", requireAuth, PersonController.wedding);
router.post("/divorce/:id", requireAuth, PersonController.divorce);

module.exports = router;
