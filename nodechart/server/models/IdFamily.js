const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const idFamilySchema = new Schema({
  id: String,
  idFamily: Number,
});
module.exports = mongoose.model("idFamily", idFamilySchema, "idFamily");
