const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { db } = require("../services/mysql");

const JWT_TOKEN = "breakthematrix";

async function createCustomerAccount(customerDetails, callback) {
  const { Password } = customerDetails;
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(Password, salt);
  let sql = "INSERT INTO customers SET ?";
  db.query(
    sql,
    { ...customerDetails, Password: hashPass },
    async (err, result) => {
      if (err) {
        callback(err);
      } else {
        let data = {
          customer: {
            PhoneNumber: customerDetails.PhoneNumber,
            Id: result.insertId,
            isCustomer: true,
          },
        };
        const authToken = jwt.sign(data, JWT_TOKEN);
        let success = true
        callback(null, {authToken, success});
      }
    }
  );
}

async function logInCustomer (customerCred, callback) {
    const {PhoneNumber, Password} = customerCred
    let sql = `SELECT * FROM customers WHERE PhoneNumber = ${PhoneNumber}`
    db.query(sql, async function(err, result) {
        if (err) {
            callback(err, null)
        } else {
            if (result.length < 1) {
                callback("customer account not found", null);
              } else {
                let comparePassword = await bcrypt.compare(
                  Password,
                  result[0].Password
                );
                if (!comparePassword) {
                  callback("password does not match", null);
                } else {
                  let data = {
                    customer: {
                      PhoneNumber,
                      Id: result[0].CustomerId,
                      isCustomer: true,
                    },
                  };
                  const authToken = jwt.sign(data, JWT_TOKEN);
                  let success = true
                  callback(null, {authToken, success});
                }
              }
        }
    })
}


async function addCustomerAddress (address, CustomerId, callback) {
  let sql = 'INSERT INTO customer_addresses SET ?'
  db.query(sql, {...address, CustomerId}, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      console.log(result.InsertId)
      callback(null, {
        AddressId: result.InsertId,
        ok: true
      })
    }
  })
}


module.exports = {
    createCustomerAccount,
    logInCustomer,
    addCustomerAddress,
}
