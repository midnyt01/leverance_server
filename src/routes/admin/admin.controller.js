const {
  createAdminAccount,
  loginInAdmin,
  createSellerAccount,
  getAllSellers,
  addNewProduct,
  getAllProducts,
  getSellerById,
  getProductById,
  updateSellerOrderStatus,
  deleteProductById,
  deleteSellerById,
  getAllSellersOrders,
  getAllCustomers,
} = require("../../models/admin.model");

async function httpCreateAdminAccount(req, res) {
  await createAdminAccount(req.body, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpLoginAdmin(req, res) {
  await loginInAdmin(req.body, function (err, data) {
    if (err) {
      res.status(404).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpCreateSellerAccount(req, res) {
  await createSellerAccount(req.body, function (err, data) {
    if (err) {
      console.log(err);
      res.status(400).json(err);
    } else {
      res.json(data);
    }
  });
}

async function httpGetAllSellers(req, res) {
  await getAllSellers(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetSellerById(req, res) {
  await getSellerById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpDeleteSellerById(req, res) {
  await deleteSellerById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

//Products

async function httpAddNewProduct(req, res) {
  await addNewProduct(req.body, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetAllProducts(req, res) {
  await getAllProducts(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetProductById(req, res) {
  await getProductById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpDeleteProductById(req, res) {
  await deleteProductById(req.params.id, function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

async function httpGetAllSellersOrders(req, res) {
  await getAllSellersOrders(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      if (data.length === 0) {
        res.status(200).json([]);
      } else {
        for (let i = 0; i < data.length; i++) {
          const {
            OrderId,
            Manufacturer,
            SellerId,
            Status,
            Payment,
            Name,
            Quantity,
          } = data[i];
          let obj = {
            OrderId,
            Manufacturer,
            SellerId,
            Status,
            Payment,
            Payload: [
              {
                Name,
                Quantity,
              },
            ],
          };
          data[i] = obj;
        }
        data.sort((a, b) => {
          return b.OrderId - a.OrderId;
        });
        let newArr = [];
        let p1 = 0,
          p2 = 1;
        newArr.push(data[0]);
        while (p2 < data.length) {
          if (newArr[p1].OrderId === data[p2].OrderId) {
            newArr[p1].Payload.push(data[p2].Payload[0]);
            p2++;
          } else {
            newArr.push(data[p2]);
            p1++;
            p2++;
          }
        }
        res.status(200).json(newArr);
      }
    }
  });
}

async function httpUpdateSellerOrderStatus(req, res) {
  console.log(req.body);
  let Id = req.params.id;
  let Status = req.body.Status;
  await updateSellerOrderStatus(Id, Status, function (err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).json(data);
    }
  });
}

//customers

async function httpGetAllCustomers (req, res) {
  await getAllCustomers(function(err, data) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })
}



module.exports = {
  httpCreateAdminAccount,
  httpLoginAdmin,
  httpCreateSellerAccount,
  httpGetAllSellers,
  httpGetSellerById,
  httpDeleteSellerById,
  httpAddNewProduct,
  httpGetAllProducts,
  httpGetProductById,
  httpDeleteProductById,
  httpGetAllSellersOrders,
  httpUpdateSellerOrderStatus,
  httpGetAllCustomers,
};
