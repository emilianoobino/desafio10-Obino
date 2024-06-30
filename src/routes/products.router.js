import express from "express";
const router = express.Router();
import ProductController from "../controllers/product.controller.js";
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

//exportamos el router
export default router;
