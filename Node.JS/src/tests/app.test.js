const request = require('supertest');
const app = require('../app');

test('Should return 200 status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
});

test('Test response text', async () => {
    const response = await request(app).get('/health');
    expect(response.text).toBe('You keep using that word. I do not think it means what you think it means.');
})

//Ran out of time and didn't get to good path tests for create order, delete order, and order list.
//Checks bad path text/status/return type for all new api endpoints
//Checks good path for update order

describe('POST /createOrder', function() {
    it('responds with text/html, 200 Status, bad path text check', function(done) {
      request(app)
        .post('/createOrder')
        .send({ 
            "order": 
            [
                {
                    "itemNumber": 1,
                    "quantity": 1
                },
                {
                    "itemNumber": 2,
                    "quantity": 1
                }
            ],
            "customer": 
            {
                "firstName": "C",
                "lastName": "Danvers",
                "age": 33,
                "address":
                {
                    "streetAddress": "417 5th Avenue Apt 10B",
                    "city": "New York",
                    "state": "NY",
                    "postalCode": "10016"
                },
                "phoneNumber": "2125551234"
            }
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(200, "You are not a current customer! Your order cannot be created.")
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('POST /updateOrder', function() {
    it('Good path text check', function(done) {
      request(app)
        .post('/updateOrder')
        .send({ 
            "order": 
            [
                {
                    "itemNumber": 1,
                    "quantity": 1
                },
                {
                    "itemNumber": 2,
                    "quantity": 1
                }
            ],
            "customer": 
            {
                "firstName": "Carol",
                "lastName": "Danvers",
                "age": 33,
                "address":
                {
                    "streetAddress": "417 5th Avenue Apt 10B",
                    "city": "New York",
                    "state": "NY",
                    "postalCode": "10016"
                },
                "phoneNumber": "2125551234"
            },
            "orderNumber": "1"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(200, "Order 1 updated!")
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('POST /updateOrder', function() {
    it('responds with text/html, 200 Status, bad path text check', function(done) {
      request(app)
        .post('/updateOrder')
        .send({ 
            "order": 
            [
                {
                    "itemNumber": 1,
                    "quantity": 1
                },
                {
                    "itemNumber": 2,
                    "quantity": 1
                }
            ],
            "customer": 
            {
                "firstName": "C",
                "lastName": "Danvers",
                "age": 33,
                "address":
                {
                    "streetAddress": "417 5th Avenue Apt 10B",
                    "city": "New York",
                    "state": "NY",
                    "postalCode": "10016"
                },
                "phoneNumber": "2125551234"
            },
            "orderNumber": "-1"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(200, "Order was not found. Please check that customer information and order number are correct.")
        .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    });
  });
  describe('POST /deleteOrder', function() {
    it('responds with text/html, 200 Status, bad path text check', function(done) {
      request(app)
        .post('/deleteOrder')
        .send({ 
            "order": 
            [
                {
                    "itemNumber": 1,
                    "quantity": 1
                },
                {
                    "itemNumber": 2,
                    "quantity": 1
                }
            ],
            "customer": 
            {
                "firstName": "C",
                "lastName": "Danvers",
                "age": 33,
                "address":
                {
                    "streetAddress": "417 5th Avenue Apt 10B",
                    "city": "New York",
                    "state": "NY",
                    "postalCode": "10016"
                },
                "phoneNumber": "2125551234"
            },
            "orderNumber": "-1"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(200, "Order was not found. Please check that customer information and order number are correct.")
        .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    });
  });

  describe('POST /orderList', function() {
    it('responds with text/html, 200 Status, non-customer text check', function(done) {
      request(app)
        .post('/orderList')
        .send(
            {
                "firstName": "C",
                "lastName": "Danvers",
                "age": 33,
                "address":
                {
                    "streetAddress": "417 5th Avenue Apt 10B",
                    "city": "New York",
                    "state": "NY",
                    "postalCode": "10016"
                },
                "phoneNumber": "2125551234"
            })
        .set('Accept', 'application/json')
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200, "[]")
        .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    });
  });