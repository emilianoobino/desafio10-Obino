import TicketModel from "../models/ticket.model.js";
import UserModel from "../models/user.model.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { generateUniqueCode, calcularTotal } from "../utils/cartutils.js";
import { logger } from "../utils/logger.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

class CartController {
    async createCart() {
        try {
            const newCart = await cartRepository.createCart();
            return newCart;
        } catch (error) {
            logger.error('Error al crear carrito en cart controller', error);
            throw error;
        }
    }

    async getProductsFromCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRepository.getProductsFromCart(cartId);
            if (!products) {
                logger.warn(`Carrito no encontrado: ${cartId}`);
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(products);
        } catch (error) {
            logger.error('Error al obtener productos del carrito', error);
            res.status(500).send("Error");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.addProduct(cartId, productId, quantity);
            const cartID = req.user.cart.toString();
            res.redirect(`/carts/${cartID}`);
        } catch (error) {
            logger.error('Error al agregar producto al carrito', error);
            res.status(500).send("Error");
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.deleteProduct(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            logger.error('Error al eliminar producto del carrito', error);
            res.status(500).send("Error");
        }
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartRepository.updateProductsInCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            logger.error('Error al actualizar productos en el carrito', error);
            res.status(500).send("Error");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.updateQuantityInCart(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            logger.error('Error al actualizar la cantidad de productos en el carrito', error);
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.emptyCart(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            logger.error('Error al vaciar el carrito', error);
            res.status(500).send("Error");
        }
    }

    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            logger.info(`Iniciando proceso de compra para el carrito: ${cartId}`);

            const cart = await cartRepository.getProductsFromCart(cartId);
            if (!cart) {
                logger.warn('Carrito no encontrado');
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            const products = cart.products;
            logger.info(`Productos en el carrito: ${JSON.stringify(products)}`);

            const productosNoDisponibles = [];

            for (const item of products) {
                const productId = item.product._id || item.product;
                logger.info(`Verificando producto: ${productId}`);

                const product = await productRepository.getProductById(productId);
                logger.info(`Producto obtenido de la base de datos: ${JSON.stringify(product)}`);

                if (!product) {
                    logger.warn(`Producto no encontrado: ${productId}`);
                    productosNoDisponibles.push(productId);
                    continue;
                }

                if (product.status === undefined || product.category === undefined) {
                    logger.warn(`Producto con campos faltantes: ${productId}`);
                    productosNoDisponibles.push(productId);
                    continue;
                }

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });
            if (!userWithCart) {
                logger.warn('Usuario con carrito no encontrado');
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products.filter(item => !productosNoDisponibles.includes(item.product._id || item.product))),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productosNoDisponibles.includes(item.product._id || item.product));
            await cart.save();

            logger.info(`Compra finalizada con éxito. Ticket ID: ${ticket._id}`);
            res.status(200).json({ productosNoDisponibles, ticketId: ticket._id });
        } catch (error) {
            logger.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

export default CartController;




