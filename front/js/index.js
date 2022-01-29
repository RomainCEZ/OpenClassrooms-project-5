import ProductProvider from "./modules/ProductProvider.js";
import Product from "./modules/Product.js";

class IndexPage {
    constructor(productProvider, router) {
        this.productProvider = productProvider;
        this.router = router;
    }

    async renderHtml() {
        const products = await this.productProvider.getAllProducts();
        this.insertProductsIntoHtml(products);
    }

    insertProductsIntoHtml(products) {
        const productsList = document.querySelector("#items");
        const fragment = new DocumentFragment();
        products.forEach( product => {
            const productHtml = new Product({ id: product._id, ...product }).createIndexPageHtmlProduct;
            fragment.appendChild(productHtml);
        })
        productsList.appendChild(fragment);
    }
}

const indexPage = new IndexPage(new ProductProvider());
indexPage.renderHtml();