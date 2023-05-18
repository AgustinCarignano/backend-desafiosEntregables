import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/facebookRegister",
  passport.authenticate("facebook", { scope: "email" })
);

router.get(
  "/githubRegister",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.post("/jwtRegister", authController.jwtRegister);

router.post("/jwtLogin", isAdmin, authController.jwtLogin);

router.post("/recovery", authController.passRecover);

router.post("/recovery/newPassword", authController.newPassword);

export default router;
