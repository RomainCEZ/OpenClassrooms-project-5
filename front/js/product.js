import ProductProvider from "./modules/ProductProvider.js";
import HtmlService from "./modules/HtmlService.js";
import Product from "./modules/Product.js";
import LocalstorageService from "./modules/LocalStorageService.js";
import Router from "./modules/Router.js";

class ProductPage {
    constructor(htmlService, productProvider, router) {
        this.htmlService = htmlService;
        this.productProvider = productProvider;
        this.router = router;
    }

    get selectedColor() {
        const colorsSelect = document.getElementById("colors");
        const colorOption = colorsSelect.options[colorsSelect.selectedIndex];
        return colorOption.value;
    }

    get selectedQty() {
        return document.getElementById("quantity").value
    }

    async renderProductPage() {
        const productId = this.htmlService.getParamFromUrl("id");
        const product = await this.productProvider.getProductById(productId);
        this.renderHtmlProduct(Product.createProduct({
            id: product._id,
            ...product
        }));
        this.addToCartClickEventListener(product._id);
    }

    renderHtmlProduct(product) {
        document.title = product.name;
        this.htmlService.insertTextContent(product.name, "#title");
        const img = document.createElement("img");
        img.src = product.img.src;
        img.alt = product.img.alt;
        this.htmlService.insertHtmlElement(img, ".item__img");
        this.htmlService.insertTextContent(product.description, "#description");
        this.htmlService.insertTextContent(product.price, "#price");
        const colorOptions = product.createColorOptionsFragment
        this.htmlService.insertHtmlElement(colorOptions, "#colors");
    }

    addToCartClickEventListener(productId) {
        const saveProductOnClick = e => {
            e.preventDefault();
            try {
                LocalstorageService.addProductToCart({
                    qty: this.selectedQty,
                    color: this.selectedColor,
                    id: productId
                });
                this.router.goToUrl("./cart.html");
            } catch(error) {
                document.getElementById("errorMsg").textContent = error.message;
            }
        }
        document.getElementById("addToCart").addEventListener("click", saveProductOnClick);
    }
}

const productPage = new ProductPage(new HtmlService(document), new ProductProvider(), new Router())
productPage.renderProductPage();