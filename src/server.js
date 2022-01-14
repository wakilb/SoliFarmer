import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(bodyParser.json());

app.get("/api/user/:name", async (req, res) => {
  const username = req.params.name;

  const client = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("solifarmer");

  const userInfo = await db.collection("farms").findOne({ name: username });
  res.status(200).json(userInfo);

  client.close();
});
app.get("/hello/:name", (req, res) => res.send(`Hello! ${req.params.name}`));
app.get("/hello", (req, res) => res.send(`Hello! ${req.body.name}`));
