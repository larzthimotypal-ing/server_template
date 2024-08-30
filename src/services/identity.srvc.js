//Libraries
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Constants
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";
import APIError from "../global/utilities/error/apiError.js";
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
//Repo
import { createUser, findUserByEmail } from "../data/repo/identity.repo.js";

export const registerUserSrvc = async (email, password) => {
  try {
    //Check if user already exists

    const emailExists = await findUserByEmail(email);

    if (emailExists) {
      return new APIError(
        "EMAIL_ALREADY_IN_USE",
        HttpStatusCodes.CONFLICT,
        true,
        "EMAIL ALREADY IN USE",
        ResponseCodes.AUTH__EMAIL_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createUser(email, hashedPassword);

    return result;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to create new user");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in creating new user"
    );
  }
};

export const loginUserSrvc = async (email, password) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return new APIError(
        "INCORRECT_CREDENTIALS",
        HttpStatusCodes.NOT_FOUND,
        true,
        "CREDENTIALS ARE INCORRECT",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new APIError(
        "INCORRECT_CREDENTIALS",
        HttpStatusCodes.NOT_FOUND,
        true,
        "CREDENTIALS ARE INCORRECT",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = jwt.sign({ userId: user._id }, secret, {
      subject: "accessApi",
      expiresIn: "30d",
    });

    return { email: user.email, accessToken };
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to login user");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in logging in user"
    );
  }
};
