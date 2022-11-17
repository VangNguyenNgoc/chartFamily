const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const idNumberSchema = new Schema({
  id: String,
  idNumber: Number,
});
module.exports = mongoose.model("idNumber", idNumberSchema, "idNumber");
