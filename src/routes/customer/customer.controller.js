const { createCustomerAccount, logInCustomer, addCustomerAddress } = require("../../models/customer.model");


async function httpCreateCustomerAccount (req, res) {
    await createCustomerAccount(req.body, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpLoginCustomer (req, res) {
    await logInCustomer(req.body, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}

async function httpAddCustomerAddress (req, res) {
    let CustomerId = req.customerId
    console.log({CustomerId})
    await addCustomerAddress(req.body, CustomerId, function(err, data) {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(data)
        }
    })
}


module.exports = {
    httpCreateCustomerAccount,
    httpLoginCustomer,
    httpAddCustomerAddress,
}