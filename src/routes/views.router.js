import express from "express";
const router = express.Router();
import ViewsController from "../controllers/view.controller.js";
const viewsController = new ViewsController();
import checkUserRole from "../middleware/checkrole.js";
import passport from "passport";

router.get("/products", viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);//solo los admins ven el stock
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);//solo los users tienen acceso al chat
router.get("/", viewsController.renderHome);

export default router;

