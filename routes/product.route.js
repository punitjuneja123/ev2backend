const express = require("express");
require("dotenv").config();

const productRoute = express.Router();
const { productModel } = require("../models/products.model");
const { authorization } = require("../middleware/authorization.middleware");

productRoute.get(
  "/products",
  authorization(["seller", "user"]),
  async (req, res) => {
    let allProducts = await productModel.find();
    res.send(allProducts);
  }
);

productRoute.post(
  "/addproducts",
  authorization(["seller"]),
  async (req, res) => {
    let payload = req.body;
    let addproduct = new productModel(payload);
    await addproduct.save();
    res.send("product added");
  }
);
productRoute.delete(
  "/deleteproducts/:productID",
  authorization(["seller"]),
  async (req, res) => {
    let productID = req.params.productID;
    await productModel.findByIdAndDelete({ _id: productID });
    res.send("product deleted");
  }
);
module.exports = { productRoute };
