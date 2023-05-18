import { verifyToken } from "../utils/jwt.utils.js";
import { logger } from "../utils/winston.js";

export function isAdmin(req, res, next) {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    for (const key in req.body) {
      req.session[key] = req.body[key];
    }
    req.user = {
      fullName: "Admin",
      email: "adminCoder@coder.com",
      role: "admin",
      cart: null,
    };
    res.cookie(
      "userSession",
      { name: "Coder", role: "admin" },
      { signed: true }
    );
    req.session.isAdmin = true;
    req.session.logged = true;
    logger.info("Admin logged in");
    res.redirect("/views/products");
  } else {
    req.session.isAdmin = false;
    next();
  }
}

export function isAdminAuth(req, res, next) {
  if (req.session.isAdmin) next();
  else logger.warning("There has been an attempt to get an admin resource");
  res
    .status(403)
    .json({ message: "Unauthorized to get access to this endpoint" });
}

export function isUserAuth(req, res, next) {
  if (!req.session.isAdmin) next();
  else logger.info("An admin has tried to get a user resource");
  res
    .status(403)
    .json({ message: "Unauthorized to get access to this endpoint" });
}

export function isClient(req, res, next) {
  const { userSession } = req.signedCookies;
  if (userSession.role === "premium" || userSession.role === "user") next();
  else {
    logger.info("An admin can't access to this endpoint");
    res
      .status(403)
      .json({ message: "Unauthorized to get access to this endpoint" });
  }
}

export function isProvider(req, res, next) {
  const { userSession } = req.signedCookies;
  if (userSession.role === "premium" || userSession.role === "admin") next();
  else {
    logger.info("An user can't access to this endpoint");
    res
      .status(403)
      .json({ message: "Unauthorized to get access to this endpoint" });
  }
}
