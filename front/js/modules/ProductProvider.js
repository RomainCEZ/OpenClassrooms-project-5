export default class ProductProvider {
    async getAllProducts() {
        try {
            const response = await fetch("http://localhost:3000/api/products");
            const products = await response.json();
            return products;
        } catch(err) {
            console.log(err);
        }
    }
    async getProductById(id) {
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`);
            const product = await res.json();
            return product;
        } catch(err) {
            console.log(err);
        }
    }
}