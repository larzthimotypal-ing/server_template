//Libraries
import mysql from "mysql2";
import Datastore from "nedb-promises";
//Constants
import HttpStatusCodes from "../../global/constants/httpStatusCodes.const.js";
import APIError from "../../global/utilities/error/apiError.js";
//Utilities
import logger from "../../global/utilities/logger.js";
const users = Datastore.create("Users.db");
export const createUser = async (email, password) => {
  try {
    const newUser = await users.insert({
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
