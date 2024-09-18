//Libraries
const Datastore = require("nedb-promises");
//Constants
const HttpStatusCodes = require("../../global/constants/httpStatusCodes.const.js");
const APIError = require("../../global/utilities/error/apiError.js");
//Utilities
const logger = require("../../global/utilities/logger.js");
const users = Datastore.create("Users.db");
const personalInfo = Datastore.create("PersonalInfo.db");
const organizationInfo = Datastore.create("OrganizationInfo.db");
//MongoDb Model
const User = require("../models/User.model.js");
const PersonalInfo = require("../models/PersonalInfo.model.js");
const OrganizationInfo = require("../models/OrganizationInfo.model.js");
const createUser = async (id, email, password) => {
  try {
    const newUser = new User({
      userId: id,
      email,
      password,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to create new user");
    logger.error(error);
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating new user"
    );
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).lean();

    return user;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find a user");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in finding user"
    );
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findOne({ userId }).lean();
    return user;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find a user");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in finding user"
    );
  }
};

const createPersonalInfo = async (id, firstName, lastName, mobileNumber) => {
  try {
    const newPersonalInfo = new PersonalInfo({
      userId: id,
      firstName,
      lastName,
      mobileNumber,
    });
    await newPersonalInfo.save();

    return newPersonalInfo;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to create personal info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating personal info"
    );
  }
};

const findPersonalInfoById = async (userId) => {
  try {
    const result = await PersonalInfo.findOne({ userId }).lean();
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find personal info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in finding personal info"
    );
  }
};

const updatePersonalInfoById = async (userId, data) => {
  try {
    const personalInfo = await PersonalInfo.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    ).lean();
    return personalInfo;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to update personal info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating personal info"
    );
  }
};

const createOrgInfo = async (id, unit, email, position) => {
  try {
    const newOrgInfo = new OrganizationInfo({
      userId: id,
      unit,
      email,
      position,
    });
    await newOrgInfo.save();

    return newOrgInfo;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to create organizational info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating organizational info"
    );
  }
};

const findOrgInfoById = async (userId) => {
  try {
    const result = await OrganizationInfo.findOne({ userId }).lean();
    return result;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to find organizational info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in finding organizational info"
    );
  }
};

const updateOrgInfoById = async (userId, data) => {
  try {
    const orgInfo = await OrganizationInfo.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    ).lean();
    return orgInfo;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to update org info");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating org info"
    );
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  createPersonalInfo,
  findPersonalInfoById,
  updatePersonalInfoById,
  createOrgInfo,
  findOrgInfoById,
  updateOrgInfoById,
};
