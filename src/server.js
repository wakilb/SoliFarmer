import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";

const port = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.json());

const toDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
    const db = client.db("solifarmer");

    await operations(db);

    client.close();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong ", error: error.message });
  }
};

app.listen(port);

//User APIs
app.get("/api/users", async (req, res) => {
  toDB(async (db) => {
    const usersList = await db.collection("users").find({}).toArray();
    res.status(200).json(usersList);
  });
});
app.get("/api/user/:id", async (req, res) => {
  const id = req.params.id;
  toDB(async (db) => {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(user);
  }, res);
});
app.post("/api/user/create", async (req, res) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const role = req.body.role;
  toDB(async (db) => {
    const userInfo = await db
      .collection("users")
      .insertOne({ name: name, lastname: lastName, email: email, role: role });
    res.status(200).json(req.body);
  });
});
app.post("/api/user/update/:id", async (req, res) => {
  const id = req.params.id;

  toDB(async (db) => {
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: req.body.name,
          lastName: req.body.lastname,
          email: req.body.email,
          role: req.body.role,
        },
      }
    );
  }, res);

  toDB(async (db) => {
    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(updatedUser);
  }, res);
});

//Just tests
app.get("/api/user/:name", async (req, res) => {
  const username = req.params.name;
  console.log(username);
  const client = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("solifarmer");

  const userInfo = await db.collection("users").findOne({ lastname: username });
  res.status(200).json(userInfo);

  client.close();
});
app.get("/hello/:name", (req, res) => res.send(`Hello! ${req.params.name}`));
app.get("/hello", (req, res) => res.send(`Hello! ${req.body.name}`));
