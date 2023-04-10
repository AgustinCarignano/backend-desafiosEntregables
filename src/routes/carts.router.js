import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";

const cartsController = new CartsController();

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post("/:cid/product/:pid", cartsController.addProduct);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProduct);
router.delete("/:cid/products/:pid", cartsController.deleteProduct);
router.delete("/:cid", cartsController.cleanCart);

export default router;
