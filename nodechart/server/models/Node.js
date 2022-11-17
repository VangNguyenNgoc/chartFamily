const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const nodeSchema = new Schema({
  //lưu id của parent
  parent: {
    type: String,
  },
  mother: {
    type: String,
  },
  //lưu id của nó để làm parent cho node khác
  parentNode: {
    type: String,
  },
  level: {
    type: Number,
  },
  idPerson: {
    type: Schema.Types.ObjectId,
    ref: "person",
  },
  idNumber: {
    type: Number,
  },
  //lưu thông tin ngang hàng, vợ-chồng
  idCouple: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "node",
        // default: "",
      },
      status: { type: Boolean },
    },
  ],
});

module.exports = mongoose.model("node", nodeSchema, "node");
