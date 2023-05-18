import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { isAdminAuth, isProvider } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/mockingproducts", productsController.getMockProducts);
router.get("/:pid", productsController.getProductById);
router.post("/", isProvider, productsController.addProduct);
router.put("/:pid", isProvider, productsController.updateProduct);
router.delete("/:pid", isProvider, productsController.deleteProduct);

export default router;

//cambiar isAdminAuth por "isProvider"
//controllar en el controller que el premiun solo pueda modificar productos que le pertenezcan
