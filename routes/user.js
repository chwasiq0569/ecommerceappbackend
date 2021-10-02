const router = require("express").Router();

router.get("/user", (req, res) => {
  res.send("GET USER");
});

module.exports = router;
