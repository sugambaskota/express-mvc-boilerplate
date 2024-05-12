import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { Request, Response } from "express";
import * as session from "express-session";
import * as morgan from "morgan";
import * as path from "path";
import * as sessionFileStore from "session-file-store";
import { v4 as uuidv4 } from "uuid";

import { SESSION_SECRET, SESSION_EXPIRY_IN_SEC } from "@/constants/env";
import { status } from "@/constants/http";
import { respondError } from "@/helpers/response";
import { csrf } from "@/middlewares/csrf";
import routes from "@/routes";
import { handleError } from "@/utils/error";
import { flash } from "@/utils/flash";
import { configureHbs } from "./hbs";
import { configurePassport } from "./passport";

export const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.use(
  session({
    genid: () => uuidv4(),
    store: new (sessionFileStore(session))({
      path: path.join(__dirname, "..", "..", "sessions"),
      retries: 0,
      ttl: +process.env[SESSION_EXPIRY_IN_SEC],
    }),
    secret: process.env[SESSION_SECRET],
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: true },
  }),
);
app.use(cookieParser(process.env[SESSION_SECRET]));

configureHbs(app);
configurePassport(app);

app.use(flash());
app.use((req, res, next) => {
  res.locals.successFlash = req.flash("successFlash");
  res.locals.errorFlash = req.flash("errorFlash");

  res.locals.csrfToken = csrf.generateToken(req, res);
  res.locals.user = req.user;
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("", routes);
app.use("*", (req: Request, res: Response) => {
  return respondError(
    req,
    res,
    status.HTTP_404_NOT_FOUND,
    "Sorry, path not found.",
  );
});

// global error handler
app.use((err, req, res, _next) => {
  // handle invalid csrf token
  if (err.code === "EBADCSRFTOKEN") {
    return respondError(
      req,
      res,
      status.HTTP_400_BAD_REQUEST,
      "Invalid CSRF token!",
    );
  }

  handleError(err);
  return respondError(
    req,
    res,
    status.HTTP_500_INTERNAL_SERVER_ERROR,
    "Something went wrong!",
  );
});
