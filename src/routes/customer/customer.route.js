const express = require("express");
const fetchCustomer = require("../../middleware/fetchcustomer");
const { httpCreateCustomerAccount, httpLoginCustomer, httpAddCustomerAddress } = require("./customer.controller");


const customerRouter = express.Router();

//auth
customerRouter.post("/createaccount", httpCreateCustomerAccount);
customerRouter.post("/login", httpLoginCustomer)

//address
customerRouter.post("/address", fetchCustomer, httpAddCustomerAddress)


module.exports = customerRouter;
