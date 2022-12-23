const express = require("express");
const fetchSeller = require("../../middleware/fetchseller");
const {
  httpLogInSeller,
  httpCreateSellerOrder,
  httpGetAllSellerOrders,
  httpGetProductCategories,
} = require("./seller.controller");

const sellerRouter = express.Router();

//auth
sellerRouter.post("/login", httpLogInSeller);

//product categories
sellerRouter.get("/products", fetchSeller, httpGetProductCategories);

//orders
sellerRouter.post("/createsellerorder", fetchSeller, httpCreateSellerOrder);
sellerRouter.get("/orders", fetchSeller, httpGetAllSellerOrders);

module.exports = sellerRouter;
