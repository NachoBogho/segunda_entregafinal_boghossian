import fs from 'fs';

export default class CartManager {

    // Constructor que inicializa la instancia de CartManager con la ruta del archivo de carritos
    constructor(path){
        this.path = path;
    }

    // Método para obtener la lista de carritos desde el archivo
    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);
                return carts;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
    // Método para obtener un carrito por su ID
    getCartById = async (id_buscada) => {
        try {
            const carts = await this.getCarts();
            const cart_found = carts.find((carrito) => carrito.id === id_buscada);
            return cart_found || {"error": "Carrito no encontrado"};
        } catch (error) {
            console.log(error);
            return {"error": error};
        }
    };

    // Método para guardar la lista actualizada de carritos en el archivo
    saveCarts = async (carts) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            console.log(error);
            return {"error": error};
        }
    };
}
