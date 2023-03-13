const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  qty: Number,
  userID: String,
});

const productModel = mongoose.model("product", productSchema);

module.exports = { productModel };
