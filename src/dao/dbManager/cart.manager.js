import fs from 'fs';

// Clase para la gestión de carritos en la base de datos
export default class CartManager {

    // Constructor que inicializa la instancia de CartManager con la ruta del archivo de carritos
    constructor(path) {
        this.path = path;
    }

    // Método para obtener la lista de carritos desde el archivo
    getCarts = async () => {
        try {
            // Verifica si el archivo existe
            if (fs.existsSync(this.path)) {
                // Lee el contenido del archivo
                const data = await fs.promises.readFile(this.path, 'utf-8');
                // Parsea el contenido JSON y lo retorna
                const carts = JSON.parse(data);
                return carts;
            } else {
                // Si el archivo no existe, retorna un array vacío
                return [];
            }
        } catch (error) {
            // En caso de error, imprime un mensaje de error y retorna un array vacío
            console.log(error);
            return [];
        }
    }
    
    // Método para obtener un carrito por su ID desde el archivo
    getCartById = async (id_buscada) => {
        try {
            // Obtiene la lista actual de carritos
            const carts = await this.getCarts();
            // Busca el carrito por su ID
            const cart_found = carts.find((carrito) => carrito.id === id_buscada);
            // Retorna el carrito encontrado o un objeto con un campo "error" si no se encuentra
            return cart_found || {"error": "Carrito no encontrado"};
        } catch (error) {
            // En caso de error, imprime un mensaje de error y retorna un objeto con un campo "error"
            console.log(error);
            return {"error": error};
        }
    };

    // Método para guardar la lista actualizada de carritos en el archivo
    saveCarts = async (carts) => {
        try {
            // Convierte la lista de carritos a formato JSON y la escribe en el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            // En caso de error, imprime un mensaje de error y retorna un objeto con un campo "error"
            console.log(error);
            return {"error": error};
        }
    };
}
