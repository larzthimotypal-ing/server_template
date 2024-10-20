//Libraries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const jspdf = require("jspdf");
const pupp = require("puppeteer");
const hbs = require("handlebars");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
//Constants
const HttpStatusCodes = require("../global/constants/httpStatusCodes.const.js");
const APIError = require("../global/utilities/error/apiError.js");
const ResponseCodes = require("../global/constants/responseCodes.const.js");
const Ecert = require("../global/constants/email/ecert.const.js");
//Utilities
const logger = require("../global/utilities/logger.js");
const sendEmail = require("../global/utilities/email/emailSender.js");
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
  updateUser,
} = require("../data/repo/identity.repo.js");
const WelcomeEmail = require("../global/constants/email/welcome.const.js");

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

    const emailContent = { html: WelcomeEmail(`${firstName} ${lastName}`) };

    const emailResult = await sendEmail(
      "Welcome to Digital Democracy Course!",
      emailContent,
      user.email
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

const resetPasswordSrvc = async (email) => {
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
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const { userId } = user;
    const resetToken = jwt.sign({ userId }, secret, {
      subject: "resetPasswordToken",
      expiresIn: "1h",
    });
    function generateResetPasswordEmail(resetLink, resetToken, expirationTime) {
      logger.info(`${resetLink}/${resetToken}`);
      return `
      <html>
      <body>
        <h2>Password Reset Request</h2>
        <p>Greetings!</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <a href="${resetLink}/${resetToken}" target="_blank">Reset Password</a>
        <p><strong>Note:</strong> This link will expire in ${expirationTime} hour. If you did not request this change, please ignore this email.</p>
        <p>Thanks,</p>
        <p>The MBC Team</p>
      </body>
      </html>
      `;
    }
    const emailResetLink = `${process.env.FE_URL}/reset-password`;
    console.log(emailResetLink);
    const emailContent = generateResetPasswordEmail(
      emailResetLink,
      resetToken,
      1
    );
    const emailResult = sendEmail(
      "Forgot Password",
      { html: emailContent },
      email
    );
    return resetToken;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to update reset user password");
    logger.error(error);
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating user profile"
    );
  }
};

const verifyResetTokenSrvc = async (token, newPassword) => {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.userId;
    const user = await findUserById(userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newUser = await updateUser(userId, hashedPassword, null);
    return newUser;
  } catch (error) {
    logger.trace("SRVC ERROR: Was not able to update reset user password");
    logger.error(error);
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating user profile"
    );
  }
};

const createPdfBuffer = async (html) => {
  try {
    const puppeteerLaunchOptions = {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    var browser = await pupp.launch(puppeteerLaunchOptions);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      printBackground: true,
      width: "1232px",
      height: "1003px",
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      // displayHeaderFooter: true,
      // headerTemplate: `
      // '<div style="font-family: Helvetica, sans-serif; font-size: 20px; text-align: center; margin-top:30px; font-weight: bold;  width: 100%; position: absolute; top: 0; left: 0;">Career Discovery with Dr. J. Procter <hr style="border: none; border-top: 1px solid black; margin-top: 2mm;" /></div>',
      // `,
      // footerTemplate: ` <div style="font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
      //     <span>Self-Directed Search</span> - <span class="pageNumber"></span>
      //   </div>`,
    });
    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.log(error);
  }
};

const generateCertSrvc = async (id) => {
  try {
    const user = await findUserById(id);
    const personal = await findPersonalInfoById(id);
    const html = Ecert({
      name: `${personal.firstName} ${personal.lastName}`,
      date: new Date(),
    });
    const pdfBuffer = await createPdfBuffer(html);
    const email = user.email;
    const emailAttachment = {
      filename: `certificate.pdf`,
      content: pdfBuffer,
    };
    const emailContent = {
      text: "Congratulations for finishing the Digital Democracy Course! Attached is your certificate.",
      attachments: [emailAttachment],
    };
    const emailResult = sendEmail(
      "Certificate of Completion",
      emailContent,
      email
    );
    logger.info(emailResult);
    return emailResult;
  } catch (error) {
    logger.trace(
      "SRVC ERROR: Was not able to generate and email the certificate"
    );
    logger.error(error);
    return new APIError(
      "SERVICE",
      HttpStatusCodes.INTERNAL_SERVER,
      true,
      "Error in updating user profile"
    );
  }
};

const sendEmailCert = async (id) => {
  try {
    const emailContent = {
      text: `ID: ${id}`,
    };
    const emailResult = await sendEmail(
      "Certificate of Completion",
      emailContent,
      "larzthimoty2421@gmail.com"
    );
    return emailResult;
  } catch (error) {
    logger.trace(
      "SRVC ERROR: Was not able to generate and email the certificate"
    );
    logger.error(error);
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
  resetPasswordSrvc,
  verifyResetTokenSrvc,
  generateCertSrvc,
  sendEmailCert,
};
