const nodemailer = require("nodemailer");
const logger = require("../logger.js");
const HttpStatusCodes = require("../../constants/httpStatusCodes.const.js");
const APIError = require("../../utilities/error/apiError.js");
require("dotenv").config();
const transport = {
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
logger.info(transport);
let transporter = nodemailer.createTransport(transport);

async function sendEmail(subject, content, receiver) {
  const { text, html, attachments } = content;
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: receiver,
    subject,
    text,
    html,
    attachments,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      logger.error(error, "EMAIL ERROR: Problem with sending email");
      return new APIError(
        "EMAIL SENDING",
        HttpStatusCodes.DATABASE_ACCESS,
        true,
        "Error in trying to send an email."
      );
    } else {
      logger.info(info.response, "EMAIL SENT");
      return info.response;
    }
  });
}

module.exports = sendEmail;
