//Constants
import ResponseCodes from "../global/constants/responseCodes.const.js";
//Utilities
import logger from "../global/utilities/logger.js";
import errorHandler from "../global/utilities/error/errorHandler.js";
//Services
import {
  getProfileSrvc,
  loginUserSrvc,
  registerUserSrvc,
  updateProfileSrvc,
} from "../services/identity.srvc.js";
import HttpStatusCodes from "../global/constants/httpStatusCodes.const.js";

export const registerUserCtrl = async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    mobileNumber,
    orgUnit,
    orgNumber,
    orgEmail,
    position,
  } = req.body;
  try {
    const personalInfo = { firstName, lastName, mobileNumber };
    const orgInfo = { orgUnit, orgNumber, orgEmail, position };
    const result = await registerUserSrvc(
      email,
      password,
      personalInfo,
      orgInfo
    );
    if (errorHandler.isTrustedError(result)) return next(result);
    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "New User created successfully",
      code: ResponseCodes.AUTH__REGISTRATION_SUCCESSFUL,
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to register a new user");
    next(error);
  }
};

export const loginUserCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await loginUserSrvc(email, password);
    if (errorHandler.isTrustedError(result)) return next(result);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Login Successful",
      code: ResponseCodes.AUTH__LOGIN_SUCCESSFUL,
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to register a new user");
    next(error);
  }
};

export const getProfileCtrl = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access to Resource",
        code: ResponseCodes.AUTH__UNAUTHORIZED_ACCESS,
      });
    }
    const result = await getProfileSrvc(user.id);

    if (errorHandler.isTrustedError(result)) return next(result);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "User Profile fetched successfully",
      code: ResponseCodes.PROF__FETCHED_SUCCESSFULLY,
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to register a new user");
    next(error);
  }
};

export const updateProfileCtrl = async (req, res, next) => {
  const user = req.user;
  const { personalInformation, orgInformation } = req.body;
  try {
    const result = await updateProfileSrvc(user.id, {
      personalInformation,
      orgInformation,
    });
    if (!user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access to Resource",
        code: ResponseCodes.AUTH__UNAUTHORIZED_ACCESS,
      });
    }
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Profile successfully updated.",
      result,
    });
  } catch (error) {
    logger.trace("CTRL ERROR: Was not able to register a new user");
    next(error);
  }
};
