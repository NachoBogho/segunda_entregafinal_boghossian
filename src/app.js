// Importación de módulos y configuración inicial
import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from './routes/product.router.js';
import cartsRouter from "./routes/cart.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ProductManager from "./dao/dbManager/product.manager.js";
const productManager = new ProductManager();
import axios from "axios";

// Creación de la aplicación Express
const app = express();

const port = 8080;

// Configuración de middleware para manejar JSON y datos de formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de vistas Handlebars
app.engine("handlebars", handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set("view engine", "handlebars");

// Configuración de directorio estático para archivos públicos
app.use(express.static(`${__dirname}/public`));

// Configuración de rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Error 404: Página no encontrada');
});

// Conexión a la base de datos MongoDB
try {
    await mongoose.connect("mongodb+srv://ignacioboghossian:xectXFVkLVYsLhFl@ecommerce.ptx5yde.mongodb.net/ecommerce?retryWrites=true&w=majority");
    console.log("Conexión a la base de datos exitosa");
} catch (error) {
    console.log(error.message);
}

// Inicialización del servidor Express
const server = app.listen(port, () => console.log("Servidor en ejecución"));

// Configuración de Socket.IO
const io = new Server(server);
app.set("socketio", io);

// Manejo de eventos de conexión con Socket.IO
io.on("connection", async (socket) => {
    const messages = await chatManager.getAll();
    console.log("Nuevo cliente conectado");
    
    socket.on("authenticated", data => {
        socket.emit("messageLogs", messages);
        socket.broadcast.emit("newUserConnected", data);
    });
    
    socket.on("message", async (data) => {
        await chatManager.save(data);
        const newMessage = await chatManager.getAll();
        io.emit("messageLogs", newMessage);
    });
});
