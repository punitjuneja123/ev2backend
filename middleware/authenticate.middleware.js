const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

function authenticate(req, res, next) {
  let token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.key, (err, decoded) => {
      if (err) {
        console.log(err);
        res.send("please provide correct token/token expired");
      } else {
        req.body.userID = decoded.userID;
        req.body.role = decoded.role;
        next();
      }
    });
  } else {
    res.send(" please provide token");
  }
}

module.exports = { authenticate };
