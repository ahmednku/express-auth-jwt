import nodemailer from "nodemailer";
import { emailConfig } from "../config/emailConfig.js";

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: emailConfig.service,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    const mailOptions = {
      from: emailConfig.auth.user,
      to,
      subject,
      text,
      ...(html && { html }),
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
