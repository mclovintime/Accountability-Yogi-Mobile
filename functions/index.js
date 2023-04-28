// const functions = require("firebase-functions");
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcrypt");
// const Netflix = require("netflix2");

// const admin = require("firebase-admin");
// admin.initializeApp();

// const app = express();
// app.use(cors());


// const db = admin.firestore();

// app.use(bodyParser.json());

// app.post("/signup", cors(), async (req, res) => {
//   const {email, password}= req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const usersRef = db.collection("users");
//   const userSnapshot = await usersRef.where("email", "==", email).get();

//   if (!userSnapshot.empty) {
//     res.status(400).json({error: "User with this email already exists"});
//     return;
//   }

//   const newUser={email, hashedPassword};
//   await usersRef.add(newUser);

//   res.status(201).json(newUser);
// });

// app.post("/login", async (req, res) => {
//   const {email, password}= req.body;

//   const usersRef = db.collection("users");
//   const userSnapshot = await usersRef.where("email", "==", email).get();

//   if (userSnapshot.empty) {
//     res.status(401).json({error: "Invalid email or password"});
//     return;
//   }

//   const user = userSnapshot.docs[0].data();
//   const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

//   if (passwordMatch) {
//     res.status(200).json({email: user.email});
//   } else {
//     res.status(401).json({error: "Invalid email or password"});
//   }
// });

// app.get("/viewing-history", async (req, res) => {
//   const credentials = {
//     email: "mclaugth01@esj.org",
//     password: "#######",
//   };

//   try {
//     const netflix = new Netflix();
//     await new Promise((resolve, reject) => {
//       netflix.login(credentials, (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     netflix.getViewingHistory((error, history) => {
//       if (error) {
//         res.status(500).json({error: error.message});
//       } else {
//         res.json(history);
//       }
//     });
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
// });

// // Export the Express app as a Firebase Function
// exports.api = functions.https.onRequest(app);
