import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authmiddleware.js";
import CartController from "../controllers/cart.controller.js";
const cartController = new CartController();

router.use(authMiddleware);

router.post("/", cartController.createCart);
router.get("/:cid", cartController.getProductsFromCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete('/:cid/product/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.updateProductsInCart);
router.put('/:cid/product/:pid', cartController.updateQuantity);
router.delete('/:cid', cartController.emptyCart);
router.post('/:cid/purchase', cartController.finalizarCompra);


export default router;