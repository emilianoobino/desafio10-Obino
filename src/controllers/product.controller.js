import ProductRepository from "../repositories/product.repository.js";
import { logger } from '../utils/logger.js';

const productRepository = new ProductRepository();

class ProductController {
    async addProduct(req, res) {
        const newProduct = req.body; 
        try {
            const data = await productRepository.addProduct(newProduct);
            logger.info(`Producto añadido: ${JSON.stringify(newProduct)}`);
            res.json(data);
        } catch (error) {
            logger.error('Error al añadir producto:', error);
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productRepository.getProducts(limit, page, sort, query);
            logger.info(`Productos obtenidos: limit=${limit}, page=${page}, sort=${sort}, query=${query}`);
            res.json(products);
        } catch (error) {
            logger.error('Error al obtener los productos:', error);
            res.status(500).json("Error al obtener los productos en controller");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const prod = await productRepository.getProductById(id);
            if (!prod) {
                logger.warn(`Producto no encontrado: ${id}`);
                return res.json({
                    error: "Producto no encontrado en controller"
                });
            }
            logger.info(`Producto obtenido: ${id}`);
            res.json(prod);
        } catch (error) {
            logger.error('Error al obtener el producto por ID:', error);
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;
            const resultado = await productRepository.updateProduct(id, productoActualizado);
            logger.info(`Producto actualizado: ${id}, datos: ${JSON.stringify(productoActualizado)}`);
            res.json(resultado);
        } catch (error) {
            logger.error('Error al actualizar el producto:', error);
            res.status(500).send("Error al actualizar el producto en controller");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.deleteProduct(id);
            logger.info(`Producto eliminado: ${id}`);
            res.json(respuesta);
        } catch (error) {
            logger.error('Error al eliminar el producto:', error);
            res.status(500).send("Error al eliminar el producto en controller");
        }
    }
}

export default ProductController;

