const router = require("express").Router();
const Product = require("../models/Product");

const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const product = new Product(req.body);
  try {
    const savedProduct = await product.save();
    res.status(200).json({ status: 1, data: savedProduct });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  try {
    res.status(200).json({ status: 1, data: updatedProduct });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  try {
    res.status(200).json({ status: 1, message: "Product has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/find/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  try {
    res.status(200).json({ status: 1, data: product });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else products = await Product.find();

    res.status(200).json({ status: 1, data: products });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
