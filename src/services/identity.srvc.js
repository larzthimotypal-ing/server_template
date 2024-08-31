//Libraries
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uuid } from "uuidv4";
//Constants
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";
import APIError from "../global/utilities/error/apiError.js";
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
//Repo
import {
  createOrgInfo,
  createPersonalInfo,
  createUser,
  findOrgInfoById,
  findPersonalInfoById,
  findUserByEmail,
  findUserById,
} from "../data/repo/identity.repo.js";

export const registerUserSrvc = async (
  email,
  password,
  personalInfo,
  orgInfo
) => {
  const { firstName, lastName, mobileNumber } = personalInfo;
  const { orgUnit, orgNumber, orgEmail, position } = orgInfo;
  try {
    //Check if user already exists
    const id = uuid();

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
    const user = await createUser(id, email, hashedPassword);
    const personal = await createPersonalInfo(
      id,
      firstName,
      lastName,
      mobileNumber
    );
    const organization = await createOrgInfo(
      id,
      orgUnit,
      orgNumber,
      orgEmail,
      position
    );

    return {
      email: user.email,
      personalInformation: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        mobileNumber: personal.mobileNumber,
      },
      orgInformation: {
        unit: organization.unit,
        number: organization.number,
        email: organization.email,
        position: organization.position,
      },
    };
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
    const id = user._id;
    const accessToken = jwt.sign({ userId: id }, secret, {
      subject: "accessApi",
      expiresIn: "30d",
    });
    const personal = await findPersonalInfoById(id);
    const organization = await findOrgInfoById(id);

    return {
      email: user.email,
      accessToken,
      personalInformation: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        mobileNumber: personal.mobileNumber,
      },
      orgInformation: {
        unit: organization.unit,
        number: organization.number,
        email: organization.email,
        position: organization.position,
      },
    };
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

export const getProfileSrvc = async (id) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return new APIError(
        "USER_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "ID does not match any user in the database",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }
    const personal = await findPersonalInfoById(id);
    if (!personal) {
      return new APIError(
        "USER_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "ID does not match any personal info in the database",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }
    const organization = await findOrgInfoById(id);
    if (!organization) {
      return new APIError(
        "USER_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "ID does not match any organizational info in the database",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }

    return {
      email: user.email,
      personalInformation: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        mobileNumber: personal.mobileNumber,
      },
      orgInformation: {
        unit: organization.unit,
        number: organization.number,
        email: organization.email,
        position: organization.position,
      },
    };
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to get user profile");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in getting user profile"
    );
  }
};
