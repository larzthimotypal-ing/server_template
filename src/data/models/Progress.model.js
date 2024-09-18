const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    module: {
      type: Number,
      required: true,
    },
    lesson: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
