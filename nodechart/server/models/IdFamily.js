const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const idFamilySchema = new Schema({
  idAutoVal: String,
  idFamily: Number,
});
module.exports = mongoose.model("idFamily", idFamilySchema, "idFamily");
