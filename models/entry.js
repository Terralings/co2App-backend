const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    date: String,
    // vehicle: String,
    distance: Number,
    carbon: String,
    googleId: String,
  },
  { timestamps: true }
);

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
