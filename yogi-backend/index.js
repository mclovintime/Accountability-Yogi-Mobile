const express = require("express");
const cors = require("cors");
const Netflix = require("netflix2");
const netflix = new Netflix();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const myVariable = process.env.mongoKey;

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string

const connectionString = myVariable;
console.log(connectionString);
let usersCollection;

MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB Atlas");
    const db = client.db("myDatabase");
    usersCollection = db.collection("users");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB Atlas", error);
  });

app.post("/signup", cors(), async (req, res) => {
  
  const { email, password } = req.body;
  console.log(`Attempting signup for user ${email}...`)
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await usersCollection.findOne({ email });

  if (existingUser) {
    res.status(400).json({ error: "User with this email already exists" });
    return;
  }

  const newUser = { email, hashedPassword };
  await usersCollection.insertOne(newUser);
  res.status(201).json(newUser);
});

app.post("/login", async (req, res) => {
  console.log("Attempting login...")
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
      res.status(200).json({ email: user.email });
      console.log("password match");
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

app.get("/viewing-history", async (req, res) => {
  const credentials = {
    email: "#########",
    password: "#######",
  };

  try {
    await new Promise((resolve, reject) => {
      netflix.login(credentials, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    netflix.getViewingHistory((error, history) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json(history);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
