import 'dotenv/config';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import CartController from '../controllers/cart.controller.js';
import generarInfoError from "../services/errores/info.js"


const cartController = new CartController();

// Función para inicializar Passport con nuestras estrategias
const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    },  async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        let rol = 'User'
        const cart = await cartsModel.create({products: []})
        try {
            if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                rol = 'Admin'
            }
            if( !first_name || !last_name || !email ) {
                throw customError.createError({
                    name: "New User",
                    cause: generarInfoError({first_name, last_name, email}),
                    message: "Error al intentar crear un usuario",
                    code: Errors.TYPE_INVALID
                })
            }
            let user = await UserModel.findOne({email})
            if (user) {
                return done(null, false)
            }

            let newCart = await cartController.createCart();
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id,
                username: first_name + " " + last_name
            };

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia para autenticar un usuario ya registrado
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            let user = await UserModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (!isValidPassword(password, user)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia para autenticación con GitHub
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email || `${profile.username}@github.com`;
            let user = await UserModel.findOne({ email });

            if (!user) {
                const newCart = await cartController.createCart();
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: profile._json.name || profile.username,
                    email: email,
                    age: 18,
                    cart: newCart._id,
                    password: createHash('github')
                };
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar y deserializar el usuario para la sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;

