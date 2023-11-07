import fs from 'fs';

export default class ProductManager {

    // Constructor que inicializa la instancia de ProductManager con la ruta del archivo de productos
    constructor(path) {
        this.path = path;
    }

    // Método para obtener la lista de productos desde el archivo
    getProducts = async () => {
        try {
            // Verifica si el archivo existe
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.error({ status: 'error', error: error });
            return [];
        }
    }

    // Método para eliminar un producto por su ID
    deleteProduct = async (id_a_eliminar) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(producto => producto.id === id_a_eliminar);
            const productoEliminado = products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return productoEliminado;
        } catch (error) {
            console.error({ status: 'error', error: error });
            return null;
        }
    };

    // Método para obtener un producto por su ID
    getProductById = async (id_buscada) => {
        try {
            const products = await this.getProducts();
            const product_found = products.find((producto) => producto.id === id_buscada);
            return product_found;
        } catch (error) {
            console.error({ status: 'error', error: error });
            return null;
        }
    };

    // Método para guardar la lista actualizada de productos en el archivo
    saveProducts = async (products) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            console.error({ status: 'error', error: error });
        }
    }
}
