const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const userRoute = express.Router();

const { userModel } = require("../models/user.model");

// register user

userRoute.post("/signup", async (req, res) => {
  let { name, email, password, role } = req.body;
  let checkUser = await userModel.find({ email });

  if (checkUser.length == 0) {
    bcrypt.hash(password + "", +process.env.salt, async (err, hash) => {
      if (err) {
        console.log(err);
        res.send("password must be of string data type");
      } else {
        let register = new userModel({ name, email, password: hash, role });
        await register.save();
        res.send("registered");
      }
    });
  } else {
    res.status(400);
    res.send("user already exists");
  }
});

userRoute.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let userData = await userModel.find({ email });
  if (userData.length > 0) {
    bcrypt.compare(password, userData[0].password, (err, result) => {
      if (result) {
        //   normal token
        const token = jwt.sign(
          {
            userID: userData[0]._id,
            role: userData[0].role,
          },
          process.env.key,
          { expiresIn: process.env.normalexp }
        );
        //   refresh token
        const refreshToken = jwt.sign(
          {
            userID: userData[0]._id,
            role: userData[0].role,
          },
          process.env.refreshKey,
          { expiresIn: process.env.refreshexp }
          );
        res.cookie("refreshToken", refreshToken);
        res.send({ msg: "logged in", token: token });
      } else {
        res.send("incorrect password");
      }
    });
  } else {
    res.send("wrong credentials");
  }
});

userRoute.post("/refresh", async (req, res) => {
  let refreshToken = req.cookies.refreshToken;
  jwt.verify(refreshToken, process.env.refreshKey, (err, decoded) => {
    if (decoded) {
      console.log(decoded);
      const token = jwt.sign(
        {
          userID: decoded.userID,
          role: decoded.role,
        },
        process.env.key,
        { expiresIn: process.env.normalexp }
      );
      res.send({ msg: "token refreshed", token: token });
    } else {
      res.send("token expired please login");
    }
  });
});

userRoute.post("/logout", async (req, res) => {
  let token = req.headers.authorization;
  let tokenList = JSON.parse(fs.readFileSync("BLtokenList.json", "utf-8"));
  tokenList.push(token);
  fs.writeFileSync("BLtokenList.json", JSON.stringify(tokenList));
  res.send("user logout");
});
module.exports = { userRoute };
