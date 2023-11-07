// Importación de módulos y configuración inicial

import { Router } from 'express';
import { productPath } from '../utils.js';
const router = Router();

import ProductManager from "../dao/dbManager/product.manager.js"
const productManager = new ProductManager(productPath);

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAll();
        return res.status(200).send({ status: "success", payload: products });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: error.message });
    }
});

// Ruta para obtener un producto por ID
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
        res.send({ status: "success", payload: product });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.delete(pid);
        const io = req.app.get('socketio');
        const products = await productManager.getAll();
        io.emit("showProducts", { products });
        return res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, category, stock, status } = req.body;
        const io = req.app.get('socketio');

        if (!title || !description || !price || !code || !category || !stock) {
            return res.status(400).send({ status: "error", message: "Valores incompletos" });
        }

        const result = await productManager.save({
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status
        });

        if (!result) {
            return res.status(400).send({ status: "error", message: "El producto ya existe" });
        }

        const products = await productManager.getAll();
        io.emit("showProducts", { products });
        return res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, category, stock, status } = req.body;
        const { pid } = req.params;
        const io = req.app.get('socketio');

        if (!title || !description || !price || !code || !category || !stock) {
            return res.status(400).send({ status: "error", message: "Valores incompletos" });
        }

        const result = await productManager.update(pid, {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status
        });

        const products = await productManager.getAll();
        io.emit("showProducts", { products });
        return res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

// Exportar el enrutador
export default router;