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

//Farm APIs
app.get("/api/farms", async (req, res) => {
  toDB(async (db) => {
    const farmsList = await db.collection("farms").find({}).toArray();
    res.status(200).json(farmsList);
  });
});
app.get("/api/farm/:id", async (req, res) => {
  const id = req.params.id;
  toDB(async (db) => {
    const farm = await db
      .collection("farms")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(farm);
  }, res);
});
app.post("/api/farm/create", async (req, res) => {
  const picture = null;
  const name = req.body.name;
  const owners = req.body.owners;
  const staff = req.body.staff;
  const visitors = req.body.visitors;
  const size = req.body.size;
  const privacy = req.body.privacy;
  const location = req.body.location;
  const extraInfo = req.body.extraInfo;
  const creator = null;

  toDB(async (db) => {
    const userInfo = await db.collection("farms").insertOne({
      name: name,
      owners: owners,
      staff: staff,
      visitors: visitors,
      size: size,
      privacy: privacy,
      location: location,
      extraInfo: extraInfo,
    });
    res.status(200).json(req.body);
  });
});
app.post("/api/farm/update/:id", async (req, res) => {
  const id = req.params.id;

  toDB(async (db) => {
    await db.collection("farms").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          picture: null,
          name: req.body.name,
          owners: req.body.owners,
          staff: req.body.staff,
          visitors: req.body.visitors,
          size: req.body.size,
          privacy: req.body.privacy,
          location: req.body.location,
          extraInfo: req.body.extraInfo,
          creator: null,
        },
      }
    );
  }, res);

  toDB(async (db) => {
    const updatedFarm = await db
      .collection("farms")
      .findOne({ _id: new ObjectId(id) });
    res.status(200).json(updatedFarm);
  }, res);
});
