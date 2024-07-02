import express from "express";
const router = express.Router();
import ViewsController from "../controllers/view.controller.js";
const viewsController = new ViewsController();
import checkUserRole from "../middleware/checkrole.js";
import passport from "passport";

// Middleware de autenticación para proteger rutas
const authMiddleware = passport.authenticate('jwt', { session: false });

// Aplicar autenticación a todas las rutas excepto login y register
router.use(authMiddleware);

router.get("/products", viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
 // solo los admins ven el stock
router.get("/chat", checkUserRole(['usuario']), viewsController.renderChat); 
// solo los users tienen acceso al chat
router.get("/", viewsController.renderHome);

// Rutas de login y register no requieren autenticación
router.use('/login', (req, res, next) => next());
router.get("/login", viewsController.renderLogin);
router.use('/register', (req, res, next) => next());
router.get("/register", viewsController.renderRegister);

export default router;

