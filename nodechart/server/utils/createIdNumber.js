const mongoose = require("mongoose");
const IdNumber = require("../models/IdNumber");

function createIdNumber() {
   IdNumberNumber =  IdNumber.findOneAndUpdate(
    { idAutoVal: "autoval" },
    { $inc: { idNumber: 1 } },
    { new: true }
  ).then(async (cd) => {
    console.log(cd);
    if (cd == null) {
      const newIdNum = await new IdNumber({
        idAutoVal: "autoval",
        idNumber: 1,
      }).save();
      return 1;
    } else {
      return cd.idNumber;
    }
  });
}

module.exports = createIdNumber;
