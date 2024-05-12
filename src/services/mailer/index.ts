import * as nodemailer from "nodemailer";

import {
  APP_NAME,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from "@/constants/env";

const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env[MAIL_HOST],
    port: +process.env[MAIL_PORT],
    auth: {
      user: process.env[MAIL_USERNAME],
      pass: process.env[MAIL_PASSWORD],
    },
  });

  return transporter;
};

export const sendMail = async ({
  recipients,
  subject,
  html,
}: {
  recipients: {
    name: string;
    address: string;
  }[];
  subject: string;
  html: string;
}) => {
  const transporter = mailTransporter();

  try {
    await transporter.sendMail({
      from: {
        name: process.env[APP_NAME],
        address: process.env[MAIL_USERNAME],
      },
      to: recipients,
      subject,
      html,
    });
  } catch (error) {
    console.log("Failed to send mail:\n", error);
  }
};
