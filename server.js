// DEPENDENCIES

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Entry = require("./models/entry");
const admin = require("firebase-admin");

//app settings
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { PORT, MONGODB_URL } = process.env;

////////////////////////////////////////////////////////////
// MONGODB STUFF; EDIT WHEN MONGODB IS CREATED
////////////////////////////////////////////////////////////

mongoose.connect(MONGODB_URL);
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//AUTHORIZATION MIDDLEWARE(google firebase)
// app.use(async (req, res, next) => {
//   const token = req.get("Authorization");
//   if (token) {
//     try {
//       const user = await admin
//         .auth()
//         .verifyIdToken(token.replace("Bearer ", ""));
//       req.user = user;
//     } catch (error) {
//       req.user = null;
//     }
//   } else {
//     req.user = null;
//   }
//   next();
// });

app.use(async (req, res, next) => {
  const token = req.get("Authorization");
  if (token) {
    const user = await admin.auth().verifyIdToken(token.replace("Bearer ", ""));
    req.user = user;
  } else {
    req.user = null;
  }
  next();
});

function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "you must be logged in" });
  } else {
    return next();
  }
}

// root page
app.get("/", (req, res) => {
  res.send("home page");
});

//GET
app.get("/home", isAuthenticated, async (req, res) => {
  try {
    // console.log(req.token);
    const reqcarbon = res.carbon;
    const userID = req.user.uid;
    // console.log("body carbon: " + reqcarbon);
    // console.log("user: " + userID);
    res.json(await Entry.find({ googleId: userID }));
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});
//CREATE
app.post("/home", isAuthenticated, async (req, res) => {
  try {
    // req.body.googleId = req.user.uid;
    // console.log(req.body);
    // console.log(req.user.uid);
    res.json(await Entry.create(req.body));
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});

//UPDATE
app.put("/home/:id", isAuthenticated, async (req, res) => {
  try {
    res.json(
      await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});
//DELETE
app.delete("/home/:id", isAuthenticated, async (req, res) => {
  try {
    res.json(
      await Entry.findByIdAndDelete(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});
// LISTEN
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
