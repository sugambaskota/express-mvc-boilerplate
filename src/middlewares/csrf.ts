import { doubleCsrf } from "csrf-csrf";

import { CSRF_SECRET } from "@/constants/env";

export const csrf = doubleCsrf({
  getSecret: () => process.env[CSRF_SECRET],
  getTokenFromRequest: (req) => req.body.csrfToken,
  cookieName:
    process.env.NODE_ENV === "production"
      ? "__Host-prod.x-csrf-token"
      : "_csrf",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
