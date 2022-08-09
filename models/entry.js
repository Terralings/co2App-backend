const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    date: String,
    vehicle: String,
    startLocation: String,
    endLocation: String,
    googleId: String,
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
