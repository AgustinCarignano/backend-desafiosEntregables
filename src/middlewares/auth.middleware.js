import { logger } from "../utils/winston.js";

export function isAdmin(req, res, next) {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    for (const key in req.body) {
      req.session[key] = req.body[key];
    }
    res.cookie(
      "userSession",
      { name: "Coder", rol: "admin" },
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
  else log.info("An admin has tried to get a user resource");
  res
    .status(403)
    .json({ message: "Unauthorized to get access to this endpoint" });
}
