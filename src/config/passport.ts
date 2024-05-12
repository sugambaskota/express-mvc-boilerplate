import { Express, Request } from "express";
import * as passport from "passport";
import * as passportLocal from "passport-local";

import { User } from "@/entities/user";
import * as authService from "@/services/auth";

export const configurePassport = (app: Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, _email, _password, cb) => cb(null, req.validatedData),
    ),
  );

  passport.serializeUser((_req: Request, user: User, cb) => {
    process.nextTick(() => {
      return cb(null, user.id);
    });
  });

  passport.deserializeUser(async (userId: string, cb) => {
    process.nextTick(async () => {
      try {
        const user = await authService.getUserById(userId);

        if (!user) {
          return cb(new Error("Sorry, user not found."));
        }

        cb(null, user);
      } catch (error) {
        cb(error);
      }
    });
  });
};
