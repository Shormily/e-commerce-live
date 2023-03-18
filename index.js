const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const objectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middle wars
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qqdu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("ecommerce").collection("services");
    const orderCollection = client.db("ecommerce").collection("orders");
    const usersCollection = client.db("ecommerce").collection("users");

    //  GET Products API
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();

      res.send(services);
    });

    app.get("/singleServices/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new objectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    // Add Orders API
    app.get("/orders", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      // console.log("order", order);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);

      res.json(result);
    });

    // CRUD OPERATION
    app.get("/services/:id", async (req, res) => {
      const id = id.params.id;
      console.log(id);
      const query = { _id: objectId(id) };
      const card = await serviceCollection.findOne(query);
      //   console.log('load user id', id);
      res.send(card);
    });
    // DELETE API

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      console.log(id);
      const result = await orderCollection.deleteOne(query);
      console.log("deleting user with id", result);
      res.json(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("e-commerce server is running");
});

app.listen(port, () => {
  console.log(`Genious car server running on ${port}`);
});
