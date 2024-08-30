//Libraries
import mysql from "mysql2";
import Datastore from "nedb-promises";
//Constants
import HttpStatusCodes from "../../global/constants/httpStatusCodes.const.js";
import APIError from "../../global/utilities/error/apiError.js";
//Utilities
import logger from "../../global/utilities/logger.js";
const users = Datastore.create("Users.db");
const personalInfo = Datastore.create("PersonalInfo.db");
const organizationInfo = Datastore.create("OrganizationInfo.db");

export const createUser = async (id, email, password) => {
  try {
    const newUser = await users.insert({
      _id: id,
      email,
      password,
    });

    return newUser;
  } catch (error) {
    logger.trace("REPO ERROR: Was not able to create new user");
    return new APIError(
      "DATABASE_ACCESS",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating new user"
    );
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await users.findOne({ email });
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

export const findUserById = async (id) => {
  try {
    const user = await users.findOne({ _id: id });
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

export const createPersonalInfo = async (
  id,
  firstName,
  lastName,
  mobileNumber
) => {
  try {
    const result = await personalInfo.insert({
      _id: id,
      firstName,
      lastName,
      mobileNumber,
    });
    return result;
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

export const findPersonalInfoById = async (id) => {
  try {
    const result = await personalInfo.findOne({ _id: id });
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

export const createOrgInfo = async (id, unit, number, email, position) => {
  try {
    const result = await organizationInfo.insert({
      _id: id,
      unit,
      number,
      email,
      position,
    });
    return result;
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

export const findOrgInfoById = async (id) => {
  try {
    const result = await organizationInfo.findOne({ _id: id });
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
