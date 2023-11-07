import { productsModel } from "../dbManager/models/products.models.js";

// Clase para la gestión de productos en la base de datos
export default class Products {
    // Constructor de la clase
    constructor() {
        console.log("Working with products from DB");
    }

    // Método para obtener todos los productos desde la base de datos
    getAll = async () => {
        // Utiliza el modelo de productos para buscar todos los productos y los retorna
        const products = await productsModel.find().lean();
        return products;
    }

    // Método para obtener un producto por su ID desde la base de datos
    getProductById = async (id) => {
        // Utiliza el modelo de productos para buscar un producto por su ID y lo retorna
        const product = await productsModel.findOne({ _id: id }).lean();
        return product;
    }

    // Método para actualizar un producto en la base de datos por su ID
    update = async (pid, product) => {
        // Utiliza el modelo de productos para actualizar un producto por su ID y retorna el resultado de la operación
        const result = await productsModel.updateOne({ _id: pid }, product);
        return result;
    }

    // Método para eliminar un producto de la base de datos por su ID
    delete = async (pid) => {
        // Utiliza el modelo de productos para eliminar un producto por su ID y retorna el resultado de la operación
        const result = await productsModel.deleteOne({ _id: pid });
        return result;
    }

    // Método para guardar un nuevo producto en la base de datos
    save = async (product) => {

        const productAlreadyExists = await productsModel.findOne({ code: product.code })
        // Si no existe un producto con el mismo código, crea el nuevo producto y retorna el resultado de la operación
        const result = !productAlreadyExists && await productsModel.create(product);
        return result;
    }
};
