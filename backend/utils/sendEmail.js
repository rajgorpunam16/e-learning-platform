const nodemailer = require("nodemailer");

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    if (!process.env.EMAIL_USER) {
      throw new Error(
        "EMAIL_USER is missing from the .env file."
      );
    }

    if (!process.env.EMAIL_PASS) {
      throw new Error(
        "EMAIL_PASS is missing from the .env file."
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const emailInfo = await transporter.sendMail({
      from: `"DVOC E-Learning" <${process.env.EMAIL_USER}>`,

      to,

      subject,

      text: text || "",

      html: html || "",
    });

    console.log(
      "Email sent successfully:",
      emailInfo.messageId
    );

    return emailInfo;
  } catch (error) {
    console.error(
      "Email sending error:",
      error.message
    );

    throw error;
  }
};

module.exports = sendEmail;