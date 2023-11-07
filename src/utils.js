import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const productPath = join (__dirname,"./files/products.json");
export const  cartPath = join (__dirname, "./files/carts.json")
