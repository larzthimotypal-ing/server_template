const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

module.exports = PersonalInfo;
