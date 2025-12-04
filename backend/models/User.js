const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    role: {
      type: String,
      enum: ["rider", "driver"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
