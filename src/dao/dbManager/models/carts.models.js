import mongoose from "mongoose";

// Define el nombre de la colección en la base de datos
const cartsCollection = "carts";

// Define el esquema de los carritos utilizando Mongoose
const cartsSchema = new mongoose.Schema({
    // Lista de productos en el carrito
    products: {
        type: [{
            // Identificador único del producto
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            // Cantidad del producto en el carrito (por defecto, 1)
            quantity: {
                type: Number,
                default: 1
            }
        }],
        default: [] // Por defecto, el carrito está vacío
    }
});

// Antes de realizar operaciones de búsqueda, popula la referencia a "products.product"
cartsSchema.pre(["find", "findOne"], function () {
    this.populate("products.product");
});

// Crea el modelo de carritos utilizando el esquema definido
export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
