// Importación de módulos y configuración inicial
import { Router } from "express";
const router = Router();
import { productPath } from '../utils.js';
import ProductManager from '../dao/dbManager/product.manager.js';
import CartManager from "../dao/dbManager/cart.manager.js";
import { productsModel } from "../dao/dbManager/models/products.models.js";

// Creación de instancias de los administradores de datos
const productManager = new ProductManager(productPath);
const cartManager = new CartManager();

// Ruta para obtener productos en tiempo real
router.get("/showproducts", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render("showproducts", { products: products });
    } catch (error) {
        return res.send({ status: 'error', error: error });
    }
});

// Ruta para obtener productos con opciones de paginación, filtrado y ordenamiento
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, queryValue, query } = req.query;

        const filtered = (query == "price" || query == "stock") ? ({ [query]: { $gt: queryValue } }) : ((queryValue) ? { [query]: { $regex: queryValue, $options: "i" } } : {});
        const sorted = sort ? ({ price: sort }) : ({});
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate(filtered, { sort: sorted, page, limit, lean: true });

        const prevLink = queryValue ? `/products?page=${prevPage}&limit=${limit}&queryValue=${queryValue}&query=${query}` : `/products?page=${prevPage}&limit=${limit}`;
        const nextLink = queryValue ? `/products?page=${nextPage}&limit=${limit}&queryValue=${queryValue}&query=${query}` : `/products?page=${nextPage}&limit=${limit}`;
        res.render("home", {
            products: docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            limit,
            query,
            queryValue,
            prevLink,
            nextLink
        });
    } catch (error) {
        return res.send({ status: 'error', error: error });
    }
});

// Ruta para obtener todos los productos sin paginación ni filtrado
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;

        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } = await productsModel.paginate({}, { sort: { price: sort }, page, limit, lean: true });

        const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/?page=${nextPage}&limit=${limit}` : null;
        res.send({
            status: "success",
            payload: docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            totalPages,
            page,
            prevLink,
            nextLink
        });
    } catch (error) {
        return res.send({ status: 'error', error: error });
    }
});

// Ruta para obtener un carrito específico por ID
router.get("/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.render("cart", { cart });
    } catch (error) {
        console.error(error.message);
    }
});

// Ruta para obtener la página de chat con todos los mensajes
router.get("/chat", async (req, res) => {
    const messages = await chatManager.getAll();
    res.render("chat", { messages });
});

// Exportar el enrutador
export default router;