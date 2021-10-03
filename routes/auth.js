const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.cryptoJSSecretKEY
    ).toString(),
  });

  try {
    const userCreated = await newUser.save();
    if (userCreated) {
      res.status(201).json(userCreated);
    } else {
      res.status(500).json({
        message: "Something went wrong, Please Try Again!",
      });
    }
  } catch (err) {
    res.status(500).json(err);
    // res.status(500).json({
    //   message: "Something went wrong, Please Try Again!",
    // });
  }
});

module.exports = router;
