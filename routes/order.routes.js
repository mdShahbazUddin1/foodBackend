const express = require("express");
const { OrderModel } = require("../models/order.model");
const orderRouter = express.Router();

orderRouter.post("/orders", async (req, res) => {
  try {
    const { user, restaurant, items, totalPrice, deliveryAddress } = req.body;

    const order = new OrderModel({
      user,
      restaurant,
      items,
      totalPrice,
      deliveryAddress,
      status: "placed",
    });
    await order.save();
    res.status(201).send({ msg: "order succesful", order });
  } catch (error) {
    res.status(400).send(error);
  }
});

orderRouter.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});
orderRouter.patch("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).send({ msg: "item not found" });
    }
    order.status = status;
    await order.save();
    res.status(200).send({msg:"status is update"});
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { orderRouter };
