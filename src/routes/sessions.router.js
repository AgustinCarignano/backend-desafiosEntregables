import { Router } from "express";
import passport from "passport";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.get(
  "/facebookCallback",
  passport.authenticate("facebook", {
    failureRedirect: "/views/errorRegister",
  }),
  sessionsController.facebookCallback
);

router.get(
  "/githubCallback",
  passport.authenticate("github", {
    failureRedirect: "/views/errorRegister",
  }),
  sessionsController.githubCallback
);

router.get(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/views/login/errorLogin",
    passReqToCallback: true,
  }),
  sessionsController.openSession
);
router.post(
  "/current",
  passport.authenticate("current", {
    failureRedirect: "/views/login/errorLogin",
    passReqToCallback: true,
  }),
  sessionsController.openSession
);

router.get(
  "/login",
  passport.authenticate("jwt_bearer"),
  sessionsController.authUser
);

router.get("/logout", sessionsController.closeSession);

export default router;
