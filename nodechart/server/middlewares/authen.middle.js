const jwt = require("jsonwebtoken");
const Person = require("../models/Person");
const Account = require("../models/Account");
const env = process.env;
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log("headers", req.headers);
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.status(401).json({
          message: "Please login.",
        });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "Please login.",
    });
  }
};
const checkPerson = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log("token", token);
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      // console.log("decodedToken", decodedToken);
      if (err) {
        res.locals.person = null;
        res.status(500).json("token is not valid");
        next();
      } else {
        let person = await Person.findOne({
          idAccount: decodedToken.id,
        })
          .populate("idNode")
          .then((person) => {
            // console.log("person", person);
            res.locals.person = person;
            res.locals.idNumber = person.idNode.idNumber;
          })
          .catch((err) => {
            console.log(err);
          });
        next();
      }
    });
  } else {
    res.locals.person = null;
    next();
  }
};

module.exports = {
  requireAuth,
  checkPerson,
};
