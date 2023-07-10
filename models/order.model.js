const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  items: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  totalPrice: { tpe: Number },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
  },
  status: { type: String }, // e.g, "placed", "preparing", "on the way", "delivered"
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };
