const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  gender: {
    type: String,
  },
  filenameImage: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  deathday: {
    type: Date,
  },
  idNode: {
    type: Schema.Types.ObjectId,
    ref: "node",
  },
  idAccount: {
    type: Schema.Types.ObjectId,
    ref: "person",
  },
});

module.exports = mongoose.model("person", personSchema, "person");
