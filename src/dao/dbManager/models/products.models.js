import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define el nombre de la colección en la base de datos
const productsCollecion = "products";

// Define el esquema de los productos utilizando Mongoose
const productsSchema = new mongoose.Schema({
    // Título del producto
    title: {
        type: String,
        required: true 
    },
    // Descripción del producto
    description: {
        type: String,
        required: true
    },
    // Precio del producto
    price: {
        type: Number,
        required: true
    },
    // URL de la miniatura del producto
    thumbnail: {
        type: String
    },
    // Código único del producto
    code: {
        type: String,
        required: true
    },
    // Categoría a la que pertenece el producto
    category: {
        type: String,
        required: true
    },
    // Cantidad disponible en stock del producto
    stock: {
        type: Number,
        required: true
    },
    // Estado del producto (activado/desactivado)
    status: {
        type: Boolean,
        default: true
    }
});

// Agrega el plugin de paginación al esquema
productsSchema.plugin(mongoosePaginate);

// Crea el modelo de productos utilizando el esquema definido
export const productsModel = mongoose.model(productsCollecion, productsSchema);