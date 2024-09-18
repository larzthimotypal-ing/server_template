const mongoose = require("mongoose");

const organizationInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrganizationInfo = mongoose.model(
  "OrganizationInfo",
  organizationInfoSchema
);

module.exports = OrganizationInfo;
