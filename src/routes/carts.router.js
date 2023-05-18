import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { isUserAuth, isClient } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post("/:cid/product/:pid", isClient, cartsController.addProduct);
router.put("/:cid", isClient, cartsController.updateCart);
router.put("/:cid/products/:pid", isClient, cartsController.updateProduct);
router.delete("/:cid/products/:pid", cartsController.deleteProduct);
router.delete("/:cid", cartsController.cleanCart);
router.get("/:cid/purchase", cartsController.checkOut);

export default router;

//cambiar isUserAuth por algo asi como "isClient"
//verificar en el controller que el premium no pueda agregar sus propios productos al carrito
