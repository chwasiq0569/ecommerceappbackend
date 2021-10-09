const router = require("express").Router();
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const Cart = require("../models/Order");

router.post("/", verifyTokenAndAuthorize, async (req, res) => {
  const order = new Order(req.body);

  try {
    const orderCreated = await order.save();
    res.status(200).json({ status: 1, data: orderCreated });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", verifyTokenAndAuthorize, async (req, res) => {
  try {
    const order = await Order.find(req.params.id);
    if (order) {
      res.status(200).json({ status: 1, data: order });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.delete(req.params.id);
    if (deletedOrder) {
      res.status(200).json({ status: 1, data: deletedOrder });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:userId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Cart.find({ userId: req.params.userId });
    if (order) {
      res.status(200).json({ status: 1, data: order });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (order) {
      res.status(200).json({ status: 1, data: order });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Cart.find();
    if (orders) {
      res.status(200).json({ status: 1, data: orders });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggreaget([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);

    res.status(200).json(income);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
