const mongoose = require("mongoose");
const path = require("path");
const Person = require("../models/Person");
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};
class AuthenController {
  async login(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    try {
      const acc = await Account.login(username, password);

      if (acc) {
        const token = createToken(acc._id);
        res.status(200).json({ token: token, idAccount: acc._id });
      } else {
        res.status(400).json({ message: "Username or password is wrong." });
      }
    } catch (err) {
      const errors = err;
      console.log("loi roi", err);
      res.status(400).json({ message: "Username or password is wrong." });
      // res.json({ error: "Sai tài khoản hoặc mật khẩu" });
    }
  }
}

module.exports = new AuthenController();
