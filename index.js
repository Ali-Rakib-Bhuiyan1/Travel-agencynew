const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.je9dp.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Connect client and make database and connection
    await client.connect();
    const database = client.db("travel_agency");
    const placeCollection = database.collection("destination");
    const serviceCollection = database.collection("resort");
    const bookCollection = database.collection("book");

    // Get all Place Collection API

    app.get("/destination/", async (req, res) => {
      const cursor = await placeCollection.find({}).toArray();
      res.send(cursor);
    });

    // Get all Package Collection API
    app.get("/package/", async (req, res) => {
      const cursor = await serviceCollection.find({}).toArray();
      res.send(cursor);
    });

    // Get All booking Package Collection API
    app.get("/allbooking/", async (req, res) => {
      const booking = await bookCollection.find({}).toArray();
      res.send(booking);
    });

    // Get a Single Package API by id
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await serviceCollection.findOne(query);
      res.send(package);
    });

    // Delete a Single booking Package API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: ObjectId(id) };
      const result = await bookCollection.deleteOne(quary);
      console.log(result);
    });

    // Update booking status
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await bookCollection.updateOne(filter, updateDoc, options);
      // console.log(id);
      res.json(result);
    });

    // Post a Single Package to bookCollection API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await bookCollection.insertOne(user);
      res.json(result);
    });

    // Add new Package API Post
    app.post("/package", async (req, res) => {
      const package = req.body;
      const result = await serviceCollection.insertOne(package);
      res.json(result);
    });

    // Get all booking from the database
    app.get("/booking/", async (req, res) => {
      const userEmail = req.query.email;
      console.log(userEmail);
      const quer = { Email: userEmail };
      result = await bookCollection.find(quer).toArray();
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

// Call run function
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("travel agency is running");
});

app.listen(port, () => {
  console.log(`travel agency ${port}`);
});
