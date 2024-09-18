//Libraries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
//Constants
const HttpStatusCodes = require("../global/constants/httpStatusCodes.const.js");
const APIError = require("../global/utilities/error/apiError.js");
const ResponseCodes = require("../global/constants/responseCodes.const.js");
//Utilities
const logger = require("../global/utilities/logger.js");
//Repo
const {
  createOrgInfo,
  createPersonalInfo,
  createUser,
  findOrgInfoById,
  findPersonalInfoById,
  findUserByEmail,
  findUserById,
  updateOrgInfoById,
  updatePersonalInfoById,
} = require("../data/repo/identity.repo.js");

const registerUserSrvc = async (email, password, personalInfo, orgInfo) => {
  const { firstName, lastName, mobileNumber } = personalInfo;
  const { orgUnit, orgEmail, position } = orgInfo;
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
    const organization = await createOrgInfo(id, orgUnit, orgEmail, position);

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

const loginUserSrvc = async (email, password) => {
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
    const { userId } = user;
    const accessToken = jwt.sign({ userId }, secret, {
      subject: "accessApi",
      expiresIn: "30d",
    });
    const personal = await findPersonalInfoById(userId);
    const organization = await findOrgInfoById(userId);

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

const getProfileSrvc = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      return new APIError(
        "USER_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "ID does not match any user in the database",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }
    const personal = await findPersonalInfoById(userId);
    if (!personal) {
      return new APIError(
        "USER_NOT_FOUND",
        HttpStatusCodes.NOT_FOUND,
        true,
        "ID does not match any personal info in the database",
        ResponseCodes.AUTH__CREDENTIALS_ARE_INCORRECT
      );
    }
    const organization = await findOrgInfoById(userId);
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

const updateProfileSrvc = async (id, updateData) => {
  const { personalInformation, orgInformation } = updateData;
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
    let newPersonalInformation = personalInformation;
    let newOrgInformation = orgInformation;
    if (personalInformation) {
      newPersonalInformation = await updatePersonalInfoById(
        id,
        personalInformation
      );
    }
    if (orgInformation) {
      newOrgInformation = await updateOrgInfoById(id, orgInformation);
    }
    return {
      personalInformation: {
        firstName: newPersonalInformation.firstName,
        lastName: newPersonalInformation.lastName,
        mobileNumber: newPersonalInformation.mobileNumber,
      },
      orgInformation: {
        unit: newOrgInformation.unit,
        email: newOrgInformation.email,
        position: newOrgInformation.position,
      },
    };
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to update user profile");
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating user profile"
    );
  }
};

module.exports = {
  registerUserSrvc,
  loginUserSrvc,
  getProfileSrvc,
  updateProfileSrvc,
};
