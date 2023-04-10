import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";

const productsController = new ProductsController();
const router = Router();

router.get("/", productsController.getProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", productsController.addProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
