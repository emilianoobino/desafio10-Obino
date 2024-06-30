import { Server as SocketServer } from "socket.io";
import ProductRepository from "../repositories/product.repository.js";
import MessageModel from "../models/message.model.js";

const productRepository = new ProductRepository();

class SocketManager {
    constructor(httpServer) {
        this.io = new SocketServer(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Cliente conectado");
            
            socket.emit("products", await productRepository.getProducts() );

            socket.on("deleteProduct", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("addProduct", async (producto) => {
                await productRepository.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                
                this.io.emit("messagesLogs", messages); //Emitir a todos los clientes
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
    }
}

export default SocketManager;