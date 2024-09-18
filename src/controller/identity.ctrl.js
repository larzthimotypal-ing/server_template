//Constants
const ResponseCodes = require("../global/constants/responseCodes.const.js");
//Utilities
const logger = require("../global/utilities/logger.js");
const errorHandler = require("../global/utilities/error/errorHandler.js");
//Services
const {
  getProfileSrvc,
  loginUserSrvc,
  registerUserSrvc,
  updateProfileSrvc,
} = require("../services/identity.srvc.js");
const HttpStatusCodes = require("../global/constants/httpStatusCodes.const.js");

const registerUserCtrl = async (req, res, next) => {
  const {
    email,
    password,
    firstName,
    lastName,
    mobileNumber,
    orgUnit,
    orgEmail,
    position,
  } = req.body;
  try {
    const personalInfo = { firstName, lastName, mobileNumber };
    const orgInfo = { orgUnit, orgEmail, position };
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

const loginUserCtrl = async (req, res, next) => {
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

const getProfileCtrl = async (req, res, next) => {
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

const updateProfileCtrl = async (req, res, next) => {
  const user = req.user;
  const { personalInformation, orgInformation } = req.body;
  try {
    if (!user) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access to Resource",
        code: ResponseCodes.AUTH__UNAUTHORIZED_ACCESS,
      });
    }
    const result = await updateProfileSrvc(user.id, {
      personalInformation,
      orgInformation,
    });
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

module.exports = {
  registerUserCtrl,
  loginUserCtrl,
  getProfileCtrl,
  updateProfileCtrl,
};
