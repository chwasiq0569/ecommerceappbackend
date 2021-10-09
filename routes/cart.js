const router = require("express").Router();
const Cart = require("../models/Cart");

router.post("/", verifyTokenAndAuthorize, async (req, res) => {
  const cart = new Cart(req.body);

  try {
    const cartCreated = await cart.save();
    res.status(200).json({ status: 1, data: cartCreated });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const cart = await Cart.find(req.params.id);
    if (cart) {
      res.status(200).json({ status: 1, data: cart });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const deletedCart = await Cart.delete(req.params.id);
    if (deletedCart) {
      res.status(200).json({ status: 1, data: cart });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:userId", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      res.status(200).json({ status: 1, data: cart });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (cart) {
      res.status(200).json({ status: 1, data: cart });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const carts = await Cart.find();
    if (carts) {
      res.status(200).json({ status: 1, data: carts });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
