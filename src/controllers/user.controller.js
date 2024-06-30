import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import UserDTO from "../dto/user.dto.js";
import { logger } from '../utils/logger.js';

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                logger.warn(`Intento de registro con email ya existente: ${email}`);
                return res.status(400).send("El usuario ya existe");
            }

            // Creo un nuevo carrito
            const newCart = new CartModel();
            await newCart.save();

            const newUser = await UserModel.create({
                first_name,
                last_name,
                email,
                cart: newCart._id, 
                password: createHash(password),
                age
            });

            await newUser.save();

            req.session.login = true;
            req.session.user = { ...newUser._doc };

            logger.info(`Nuevo usuario registrado: ${email}`);
            res.redirect("/api/users/profile");
        } catch (error) {
            logger.error('Error en registro de usuario:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                logger.warn(`Intento de login con email no registrado: ${email}`);
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                logger.warn(`Intento de login con contraseña incorrecta: ${email}`);
                return res.status(401).send("Contraseña incorrecta");
            }

            req.session.login = true;
            req.session.user = { ...usuarioEncontrado._doc };

            logger.info(`Usuario logueado: ${email}`);
            res.redirect("/api/users/profile");
        } catch (error) {
            logger.error('Error en login de usuario:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        // Con DTO
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
        logger.info(`Perfil del usuario renderizado: ${req.user.email}`);
    }

    async logout(req, res) {
        req.session.destroy();
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
        logger.info(`Usuario deslogueado: ${req.user.email}`);
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            logger.warn(`Acceso denegado para usuario: ${req.user.email}`);
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
        logger.info(`Acceso a página de admin por: ${req.user.email}`);
    }
}

export default UserController;
