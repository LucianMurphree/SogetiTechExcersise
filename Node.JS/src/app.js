const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const fs = require("fs");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Reusable file reader
function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}
//Increments order number for new orders.
//If this was DB based the DB would take care of this.
function orderNumber(orderList){
  var orderNumber = 0;
  orderList.forEach(o => {
    if(o.orderNumber >= orderNumber){
      orderNumber = o.orderNumber;
    }
  });
  return orderNumber + 1;
}

//Checks first name, last name, and phone number for customer equality. 
function customerEqual(customer1, customer2){
  return (customer1.firstName == customer2.firstName 
      && customer1.lastName == customer2.lastName 
      && customer1.phoneNumber == customer2.phoneNumber);
}

app.get('/health', (req, res) => {
   res.send('You keep using that word. I do not think it means what you think it means.');
});


app.post('/orderList', (req, res) => {
  var customer = req.body; 
  jsonReader("../data/orders.json", (err, order) => {
    if (err) {
      console.log(err);
      return;
    }
    //Flags orders in list not by customer
    order.forEach(o => {
      if(!customerEqual(o.customer, customer)){
        o.delete = true;
      }
    });
    //Filters list 
    var customerOrders = order.filter(o => !o.delete);
    //Returns filtered list
    res.send(customerOrders); 
  });
});


app.post('/createOrder',(req, res) => {
  var newOrder = req.body; 
  var currentCustomer = false; 
  jsonReader("../data/customers.json", (err, customers) => {
    if (err) {
      console.log(err);
      return;
    }
    //Checks if the customer is a current customer.
    customers.forEach(customer => {
      if(customerEqual(customer, newOrder.customer)){
        currentCustomer = true;
      }
    });
    if(!currentCustomer){
      //If not a current customer the order is not created. 
      res.send("You are not a current customer! Your order cannot be created.");
    }
    else{
      jsonReader("../data/orders.json", (err, order) => {
        if (err) {
          console.log(err);
          return;
        }
          //Set order number 
          newOrder.orderNumber = orderNumber(order);
          //push to array of orders
          order.push(newOrder);
          //Write to file.
          fs.writeFileSync('../data/orders.json', JSON.stringify(order));
          //Send response with order number.
          res.send("Order created! Order number: " + newOrder.orderNumber);
      });
    }
  });
  
});


app.post('/deleteOrder',(req, res) => {
  var newOrder = req.body;
  jsonReader("../data/orders.json", (err, order) => {
    if (err) {
      console.log(err);
      return;
    }
    var returnMsg = "Order was not found. Please check that customer information and order number are correct.";
    //This loop checks that the customer and order number match an existing order.
    //If a match is found, it's deleted and a message is sent to that effect. 
    var index = 0;
    order.forEach(o => {
      if(customerEqual(o.customer, newOrder.customer) 
        && o.orderNumber == newOrder.orderNumber){
          order.splice(index, 1);
          fs.writeFileSync('../data/orders.json', JSON.stringify(order));
          returnMsg = "Order " + newOrder.orderNumber + " deleted!";
      }
      index++; 
    });
    //Error message returned if order is not found.
    res.send(returnMsg);
  });
});


app.post('/updateOrder',(req, res) => {
  var newOrder = req.body;
  jsonReader("../data/orders.json", (err, order) => {
    if (err) {
      console.log(err);
      return;
    }
    var returnMsg = "Order was not found. Please check that customer information and order number are correct.";
    //This loop checks that the customer and order number match an existing order.
    //If a match is found, the new order is inserted in its place. 
    //Message is sent to that effect. 
    var index = 0;
    order.forEach(o => {
      if(customerEqual(o.customer, newOrder.customer) 
        && o.orderNumber == newOrder.orderNumber){
          order.splice(index, 1, newOrder);
          fs.writeFileSync('../data/orders.json', JSON.stringify(order));
          returnMsg = "Order " + newOrder.orderNumber + " updated!";
      }
      index++; 
    });
    //Error message returned if order is not found.
    res.send(returnMsg);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;