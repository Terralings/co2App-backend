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

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service-key.json")),
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

// root page
app.get("/", (req, res) => {
  res.send("home page");
});

//GET
app.get("/home", async (req, res) => {
  try {
    res.json(await Entry.find({}));
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});
//CREATE
app.post("/home", async (req, res) => {
  try {
    res.json(await Entry.create(req.body));
  } catch (error) {
    console.log("error: " + error);
    res.json({ error: "something went wrong" });
  }
});

//UPDATE
app.put("/home/:id", async (req, res) => {
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
app.delete("/home/:id", async (req, res) => {
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
