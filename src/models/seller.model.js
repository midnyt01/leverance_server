const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const { db } = require("../services/mysql")

const JWT_TOKEN = 'breakthematrix'


async function logInSeller (sellerCred, callback) {
    const {PhoneNumber, Password} = sellerCred
    let sql = `SELECT * FROM sellers WHERE PhoneNumber = ${PhoneNumber}`
    db.query(sql, async function(err, result) {
        if (err) {
            callback(err, null)
        } else {
            if (result.length < 1) {
                callback("seller account not found", null);
              } else {
                let comparePassword = await bcrypt.compare(
                  Password,
                  result[0].Password
                );
                if (!comparePassword) {
                  callback("password does not match", null);
                } else {
                  let data = {
                    seller: {
                      PhoneNumber,
                      Id: result[0].SellerId,
                      isSeller: true,
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

// get product categories


async function getProductCategories (callback) {
  let sql = 'SELECT * FROM product_categories'
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, result)
    }
  })
}




// Creating Orders

async function createSellerOrder (orderDetails, callback) {
  const {Manufacturer, Status, Payment, SellerId} = orderDetails
  let sql = 'INSERT INTO seller_orders SET ?'
  db.query(sql, {Manufacturer, Status, Payment, SellerId}, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      console.log('insert id', result.insertId)
      callback(null, {
        ok: true,
        OrderId: result.insertId
      })
    }
  })

}

async function createOrderPayload (Payload, OrderId, callback) {
  let sql = 'INSERT INTO seller_order_payload (OrderId, ProductId, Quantity) VALUES ?'
  db.query(sql, [
    Payload.map(item => [
      OrderId,
      item.ProductId,
      item.Quantity
    ]
    )]
    , function(err, result) {
      if (err) {
        callback(err, null)
      } else {
        callback(null, 'order placed successfully')
      }
    })
}

async function getAllSellerOrders (SellerId, callback) {
  let sql = `SELECT * FROM seller_orders 
      JOIN seller_order_payload ON seller_orders.OrderId = seller_order_payload.OrderId 
      JOIN product_categories ON seller_order_payload.ProductId = product_categories.ProductId
    WHERE SellerId = ${SellerId}`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      console.log({result})
      callback(null, result)
    }
  })
}




module.exports = {
    logInSeller,
    getProductCategories,
    createSellerOrder,
    createOrderPayload,
    getAllSellerOrders,
}