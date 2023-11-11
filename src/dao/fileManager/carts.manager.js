// Importa la librería 'fs' para trabajar con el sistema de archivos.
import fs from 'fs';

// Exporta una clase llamada 'CartManager'.
export default class CartManager {

    // Constructor de la clase que recibe una ruta de archivo 'path'.
    constructor(path){
        this.path=path;
    }

    // Método para obtener los carritos desde el archivo.
    getCarts = async ()=> {
        try {
            // Verifica si el archivo existe en la ruta especificada.
            if (fs.existsSync(this.path)) {
                // Lee el contenido del archivo como texto.
                const data = await fs.promises.readFile(this.path, 'utf-8');
                // Convierte el texto a un objeto JavaScript (en este caso, un arreglo de carritos).
                const carts = JSON.parse(data);
                return carts;
            } else {
                // Si el archivo no existe, devuelve un arreglo vacío.
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Método para obtener un carrito por su ID.
    getCartById=async (id_buscada)=>{
        try{
            // Obtiene todos los carritos.
            const carts = await this.getCarts();
            // Busca un carrito con el ID especificado.
            const cart_found=carts.find((carrito) => carrito.id===id_buscada)
            return cart_found;
        } catch (error) {
            console.log(error);
            return {"error": error};
        }
    };

    // Método para guardar los carritos en el archivo.
    saveCarts = async (carts) =>{
        try {
            // Escribe el arreglo de carritos en el archivo como texto JSON.
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error){
            return res.status(500).send({ status: 'error', error: error });
        }
    };
}