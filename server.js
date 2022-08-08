// DEPENDENCIES

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

require("dotenv").config();

const { PORT } = process.env;

////////////////////////////////////////////////////////////
// MONGODB STUFF; EDIT WHEN MONGODB IS CREATED
////////////////////////////////////////////////////////////

// mongoose.connect(MONGODB_URL);
// // Connection Events
// mongoose.connection
//     .on("open", () => console.log("You are connected to mongoose"))
//     .on("close", () => console.log("You are disconnected from mongoose"))
//     .on("error", (error) => console.log(error));

// //MIDDLEWARES
// app.use(cors());
// app.use(express.json())
// app.use(morgan('dev'))

// root page
app.get("/", (req, res) => {
  res.send("home page");
});

// LISTEN
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
