import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import usersController from "../controllers/users.controller.js";
import { verifyDocuments } from "../middlewares/upgradeUser.middleware.js";

const router = Router();

router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profile-avatar", maxCount: 1 },
    { name: "product-product", maxCount: 1 },
    { name: "document-identification", maxCount: 1 },
    { name: "document-address", maxCount: 1 },
    { name: "document-account", maxCount: 1 },
  ]),
  usersController.saveDocuments
);

router.get("/premium/:uid", verifyDocuments, usersController.upgradeUser);

export default router;
