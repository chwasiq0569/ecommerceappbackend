const router = require("express").Router();
const Product = require("../models/Product");

const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const product = new Product(req.body);
  try {
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const updatedProduct = new Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  try {
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
