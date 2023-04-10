import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controllers/users.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const usersController = new UsersController();
const router = Router();

router.get(
  "/facebookRegister",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/facebookCallback",
  passport.authenticate("facebook", {
    failureRedirect: "/views/errorRegister",
  }),
  usersController.facebookCallback
);

router.get(
  "/githubRegister",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubCallback",
  passport.authenticate("github", {
    failureRedirect: "/views/errorRegister",
  }),
  usersController.githubCallback
);

router.post("/jwtRegister", usersController.jwtRegister);

router.post("/jwtLogin", isAdmin, usersController.jwtLogin);

router.get(
  "/verifyToken",
  passport.authenticate("jwt", {
    failureRedirect: "/views/login/errorLogin",
    passReqToCallback: true,
  }),
  usersController.openSession
);

router.get("/logout", usersController.closeSession);

export default router;
