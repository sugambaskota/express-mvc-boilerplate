import { ExpressHandlebars } from "express-handlebars";
import * as path from "path";

import { APP_HOST, APP_NAME } from "@/constants/env";
import { User } from "@/entities/user";
import { sendMail } from "@/services/mailer";

export const handleUserRegisteredEvent = async (user: User) => {
  const handlebars = new ExpressHandlebars();
  const html = await handlebars.render(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "views",
      "mail",
      "verification.hbs",
    ),
    {
      appName: process.env[APP_NAME],
      appHost: process.env[APP_HOST],
      email: user.email,
      verificationToken: user.verificationToken,
    },
  );

  await sendMail({
    recipients: [
      {
        name: user.fullName,
        address: user.email,
      },
    ],
    subject: "Email Verification",
    html,
  });
};

export const handleForgotPasswordEvent = async (user: User) => {
  const handlebars = new ExpressHandlebars();
  const html = await handlebars.render(
    path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "views",
      "mail",
      "reset-password.hbs",
    ),
    {
      appName: process.env[APP_NAME],
      appHost: process.env[APP_HOST],
      email: user.email,
      passwordResetToken: user.passwordResetToken,
    },
  );

  await sendMail({
    recipients: [
      {
        name: user.fullName,
        address: user.email,
      },
    ],
    subject: "Forgot Password",
    html,
  });
};
