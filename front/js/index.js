import ProductProvider from "./modules/ProductProvider.js";
import HtmlService from "./modules/HtmlService.js";
import Product from "./modules/Product.js";

class IndexPage {
    constructor(htmlService, productProvider) {
        this.htmlService = htmlService;
        this.productProvider = productProvider;
    }

    async renderIndexPage() {
        const products = await this.productProvider.getAllProducts();
        this.renderHtmlProducts(products);
    }

    renderHtmlProducts(products) {
        const htmlProductsList = products.map( product => new Product({ id: product._id, ...product }).createIndexPageHtmlProduct)
        const productsFragment = this.htmlService.createFragment(htmlProductsList)
        this.htmlService.insertHtmlElement(productsFragment, "#items");
    }
}

const indexPage = new IndexPage(new HtmlService(document), new ProductProvider());
indexPage.renderIndexPage();