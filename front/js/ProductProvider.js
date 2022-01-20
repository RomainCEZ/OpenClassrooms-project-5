class ProductProvider {
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
            return new Product({ 
                id: product._id,
                img: {
                    src: product.imageUrl,
                    alt: product.altTxt
                }, 
                name: product.name,
                description: product.description,
                colors: product.colors,
                price: product.price 
            });
        } catch(err) {
            console.log(err);
        }
    }
}