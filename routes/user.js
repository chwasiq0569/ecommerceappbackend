const {
  verifyToken,
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");

const router = require("express").Router();

router.get("/userstats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);

    res.status(200).json(data);
  } catch (err) {}
});

router.put("/:id", verifyTokenAndAuthorize, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.cryptoJSSecretKEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;

    res.status(200).json(others);
  } catch (err) {
    re.status(500).json(err);
  }
});

//delete user

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 1, message: "User has been deleted successfully!" });
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
});

//get user

router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("USERRR", user);
    if (user) {
      const { password, ...others } = user?._doc;

      return res.status(200).json({ status: 1, user: others });
    } else {
      return res
        .status(401)
        .json({ status: 0, message: "User does not exists!" });
    }
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    if (users) {
      // const { password, ...others } = user?._doc;
      return res.status(200).json({
        status: 1,
        users: users.map((user) => {
          const { password, ...others } = user?._doc;
          return others;
        }),
      });
    } else {
      return res
        .status(401)
        .json({ status: 0, message: "User does not exists!" });
    }
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
});

module.exports = router;
