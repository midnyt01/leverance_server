const {
  logInSeller,
  createSellerOrder,
  createOrderPayload,
  getAllSellerOrders,
  getProductCategories,
} = require("../../models/seller.model");
var jwt = require("jsonwebtoken");
const JWT_TOKEN = "breakthematrix";

async function httpLogInSeller(req, res) {
  await logInSeller(req.body, function (err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(data);
    }
  });
}

// Product Categories

async function httpGetProductCategories(req, res) {
  await getProductCategories(function (err, data) {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(data);
    }
  });
}

//Seller Orders

async function httpCreateSellerOrder(req, res) {
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_TOKEN);
  const Id = data.seller.Id;
  const orderDetails = { ...req.body, SellerId: Id };
  console.log(orderDetails);
  await createSellerOrder(orderDetails, async function (err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log({ data });
      await createOrderPayload(req.body.Payload, data.OrderId, function (err, data2) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(data);
        }
      });
    }
  });
}

async function httpGetAllSellerOrders(req, res) {
  const token = req.header("auth-token");
  const data = jwt.verify(token, JWT_TOKEN);
  const Id = data.seller.Id;
  console.log("seller Id", Id);
  await getAllSellerOrders(Id, function (err, data) {
    if (err) {
      res.status(400).send(err);
    } else {
      console.log(data)
      if (data.length === 0) {
        res.status(200).json([])
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
        data.sort((a,b) => {
          return b.OrderId - a.OrderId
        })
        let newArr = []
        let p1 = 0, p2 = 1
        newArr.push(data[0])
        while (p2 < data.length) {
          if (newArr[p1].OrderId === data[p2].OrderId) {
            newArr[p1].Payload.push(data[p2].Payload[0])
            p2++
          } else {
            newArr.push(data[p2])
            p1++
            p2++
          }
        }
        res.status(200).json(newArr)
      }
    }
  });
}

module.exports = {
  httpLogInSeller,
  httpGetProductCategories,
  httpCreateSellerOrder,
  httpGetAllSellerOrders,
};
