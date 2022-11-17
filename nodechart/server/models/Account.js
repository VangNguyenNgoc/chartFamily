const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const accountSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  idPerson: {
    type: Schema.Types.ObjectId,
    ref: "person",
  },
});

accountSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password); //123456 => 'dsdsdlsdkjaldkjal'=> 123456
    if (auth) {
      return user;
    }
    throw Error("Sai tài khoản hoặc mật khẩu");
  }
  throw Error("Tai khoan chua dang ky!");
};
module.exports = mongoose.model("account", accountSchema, "account");
