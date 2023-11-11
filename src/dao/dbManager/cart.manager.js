// Importa el modelo de carritos ("cartsModel") desde la carpeta "dbManager/models".
import { cartsModel } from "../dbManager/models/carts.models.js";

// Exporta una clase llamada "Carts".
export default class Carts {
    // Constructor de la clase. Se ejecuta cuando se crea una instancia de la clase.
    constructor() {
        console.log("Working with carts from DB");
    }

    // Método para obtener todos los carritos de la base de datos.
    getAll = async () => {
        // Obtiene todos los carritos y los convierte a un formato más legible (POJO).
        const carts = await cartsModel.find().lean();
        return carts;
    }

    // Método para obtener un carrito por su ID.
    getCartById = async (id) => {
        // Obtiene un carrito por su ID y lo convierte a un formato más legible (POJO).
        const cart = await cartsModel.findOne({ _id: id }).lean();
        return cart;
    }

    // Método para actualizar un carrito con nuevos productos.
    update = async (cid, products) => {
        // Actualiza un carrito por su ID con los nuevos productos proporcionados.
        const result = await cartsModel.updateOne({ _id: cid }, products);
        return result;
    }

    // Método para eliminar un carrito por su ID.
    delete = async (cid) => {
        // Elimina un carrito por su ID y asegura que la lista de productos esté vacía.
        const result = await cartsModel.updateOne({ _id: cid, products: [] });
        return result;
    }

    // Método para eliminar un producto de un carrito por su ID de carrito y el ID de producto.
    deleteProduct = async (cid, pid) => {
        // Elimina un producto específico de un carrito por sus IDs.
        const result = await cartsModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: { _id: pid } } } }
        );
        return result;
    }

    // Método para crear un nuevo carrito en la base de datos.
    save = async () => {
        // Crea un nuevo carrito con una lista de productos vacía.
        const result = await cartsModel.create({});
        return result;
    }
}