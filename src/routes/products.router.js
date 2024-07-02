import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authmiddleware.js";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();

router.use(authMiddleware);

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", authMiddleware, productController.addProduct);
router.put("/:pid", authMiddleware, productController.updateProduct);
router.delete("/:pid", authMiddleware, productController.deleteProduct);


export default router;

