// Importación de módulos y configuración inicial
import { Router } from 'express';
import { cartPath } from '../utils.js';
import { productPath } from '../utils.js';
import fs from 'fs';

import CartManager from "../dao/dbManager/cart.manager.js";
import ProductManager from "../dao/dbManager/product.manager.js"
const router = Router();

const cartManager = new CartManager(cartPath);
const productManager = new ProductManager(productPath);

// Ruta para obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const result = await cartManager.save();
        res.status(201).send({ status: 'success', message: "Carrito creado", payload: result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.getCartById(cid);
        const product = await productManager.getProductById(pid);

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        if (cart.products.length === 0) {
            cart.products.push({ "product": pid, "quantity": 1 });
        } else {
            const indexProductInCart = cart.products.findIndex(product => product.product._id.toString() === pid);

            if (indexProductInCart !== -1) {
                cart.products[indexProductInCart].quantity++;
            } else {
                cart.products.push({ "product": pid, "quantity": 1 });
            };
        }

        const result = await cartManager.update(cid, { "products": cart.products });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Ruta para eliminar un carrito por ID
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        const result = await cartManager.delete(cid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto de un carrito por ID de producto
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        if (cart.products.length !== 0) {
            const indexProductInCart = cart.products.findIndex(product => product.product._id.toString() === pid);

            if (indexProductInCart !== -1) {
                cart.products.splice(indexProductInCart, 1);
            }
        }

        const result = await cartManager.update(cid, { "products": cart.products });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Ruta para actualizar un carrito por ID
router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        const { cid } = req.params;

        if (!products) {
            return res.status(400).send({ status: "error", message: "Valores incompletos" });
        }

        const result = await cartManager.update(cid, { "products": products });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Ruta para actualizar la cantidad de un producto en un carrito por ID de producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const amount = req.body;
        const cart = await cartManager.getCartById(cid);
        const product = await productManager.getProductById(pid);

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }

        if (cart.products.length === 0) {
            cart.products.push({ "product": pid, "quantity": amount.quantity });
        } else {
            const indexProductInCart = cart.products.findIndex(product => product.product._id.toString() === pid);

            if (indexProductInCart !== -1) {
                cart.products[indexProductInCart].quantity += amount.quantity;
            } else {
                cart.products.push({ "product": pid, "quantity": amount.quantity });
            };
        }

        const result = await cartManager.update(cid, { "products": cart.products });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
});

// Exportar el enrutador
export default router;