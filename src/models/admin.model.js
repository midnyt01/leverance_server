const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create admin account

const { db } = require("../services/mysql");

const JWT_TOKEN = "breakthematrix";

async function createAdminAccount(adminDetails, callback) {
  //encrypt password
  const { Password } = adminDetails;
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(Password, salt);
  let sql = "INSERT INTO admins SET ?";
  db.query(
    sql,
    { ...adminDetails, Password: hashPass },
    async (err, result) => {
      if (err) {
        callback(err);
      } else {
        let data = {
          admin: {
            PhoneNumber: adminDetails.PhoneNumber,
            isAdmin: true,
          },
        };
        const authToken = jwt.sign(data, JWT_TOKEN);
        let success = true
        callback(null, {authToken, success});
      }
    }
  );
}

async function loginInAdmin(adminCreds, callback) {
  const { PhoneNumber, Password } = adminCreds;
  let sql = `SELECT * FROM admins WHERE PhoneNumber = ${PhoneNumber}`;
  db.query(sql, async (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      if (result.length < 1) {
        callback("admin not found", null);
      } else {
        let comparePassword = await bcrypt.compare(
          Password,
          result[0].Password
        );
        if (!comparePassword) {
          callback("password does not match", null);
        } else {
          let data = {
            admin: {
              PhoneNumber,
              isAdmin: true,
            },
          };
          const authToken = jwt.sign(data, JWT_TOKEN);
          let success = true
          callback(null, {authToken, success});
        }
      }
    }
  });
}

//Seller functions

async function createSellerAccount(sellerDetails, callback) {
  const { Password } = sellerDetails;
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(Password, salt);
  let sql = "INSERT INTO sellers SET ?";
  db.query(
    sql,
    { ...sellerDetails, Password: hashPass },
    async (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, {
          ok: true,
          SellerId: result.insertId
        });
      }
    }
  );
}

async function getAllSellers(callback) {
  let sql = "SELECT * FROM sellers ORDER BY SellerId DESC";
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

async function getSellerById(id, callback) {
  let sql = `SELECT * FROM sellers WHERE SellerId = ${id}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result[0]);
    }
  });
}


async function deleteSellerById(Id, callback) {
  let sql = `DELETE FROM sellers WHERE SellerId = ${Id}`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, {
        ok: true
      })
    }
  })
}

//Product Function

async function addNewProduct(productDetails, callback) {
  let sql = "Insert INTO products SET ?";
  db.query(sql, productDetails, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { 
        ok : true,
        ProductId: result.insertId
      });
    }
  });
}

async function getAllProducts(callback) {
  let sql = "SELECT * FROM products ORDER BY CreatedAt DESC";
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

async function getProductById(id, callback) {
  let sql = `SELECT * FROM products WHERE ProductId = ${id}`;
  db.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result[0]);
    }
  });
}

async function deleteProductById(Id, callback) {
  let sql = `DELETE FROM products WHERE ProductId = ${Id}`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, {ok : true})
    }
  })
}


//Seller orders


async function getAllSellersOrders (callback) {
  let sql = `SELECT * FROM seller_orders 
  JOIN seller_order_payload ON seller_orders.OrderId = seller_order_payload.OrderId 
  JOIN product_categories ON seller_order_payload.ProductId = product_categories.ProductId`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, result)
    }
  })
}

async function updateSellerOrderStatus (OrderId, Status, callback) {
  let sql = `UPDATE seller_orders SET Status = ? WHERE OrderId = ?`
  db.query(sql,[Status, OrderId], function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, {
        ok: true
      })
    }
  })
}


//customers 


async function getAllCustomers (callback) {
  let sql = `SELECT FirstName, PhoneNumber, AltNumber, Country, State, City, Pincode, Landmark, BuildingName, AddressType FROM customers
    JOIN customer_addresses ON customers.CustomerId = customer_addresses.CustomerId`
  db.query(sql, function(err, result) {
    if (err) {
      callback(err, null)
    } else {
      console.log(result)
      callback(null, result)
    }
  })
}


module.exports = {
  createAdminAccount,
  loginInAdmin,
  createSellerAccount,
  getAllSellers,
  getSellerById,
  deleteSellerById,
  addNewProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  getAllSellersOrders,
  updateSellerOrderStatus,
  getAllCustomers,
};
