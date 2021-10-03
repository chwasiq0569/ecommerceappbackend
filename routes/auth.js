const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

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
      const { password, ...others } = userCreated._doc;

      res.status(201).json(others);
    } else {
      res.status(500).json({
        message: "Something went wrong, Please Try Again!",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (user) {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.cryptoJSSecretKEY
      );
      const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      if (userPassword === req.body.password) {
        const { password, ...others } = user._doc;

        const accessToken = jwt.sign(
          {
            id: user?.id,
            isAdmin: user?.isAdmin,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" }
        );

        res.status(200).json({ ...others, accessToken });
      } else {
        res
          .status(401)
          .json({ message: "You have entered wrong username or password!" });
      }
    } else {
      res
        .status(401)
        .json({ message: "You have entered wrong username or password!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
