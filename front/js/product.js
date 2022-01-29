import ProductProvider from "./modules/ProductProvider.js";
import Product from "./modules/Product.js";
import LocalstorageService from "./modules/LocalStorageService.js";
import Router from "./modules/Router.js";

class ProductHtmlService {
    constructor (document) {
        this.document = document;
    }
    addProductIntoPage(product) {
        this.document.title = product.name;

        this.document.getElementById("title")
            .textContent = product.name;

        const img = document.createElement("img");
        img.src = product.img.src;
        img.alt = product.img.alt;
        this.document.querySelector(".item__img").appendChild(img);
        
        document.getElementById("description")
            .textContent = product.description;

        this.document.getElementById("price")
            .textContent = product.price;
        
        const colors = this.document.getElementById("colors");
        const colorOptions = product.createColorOptionsFragment
        colors.appendChild(colorOptions);
    }

    getColor() {
        const colorsSelect = this.document.getElementById("colors");
        const colorOption = colorsSelect.options[colorsSelect.selectedIndex];
        return colorOption.value;
    }
    
    getQty() {
        const qtyInput = this.document.getElementById("quantity");
        return Number(qtyInput.value);
    }
    
    setMinQtyToOne() {
        const qtyInput = this.document.getElementById("quantity");
        qtyInput.value = 1;
    }
}

// eslint-disable-next-line no-unused-vars
class ProductPage {
    constructor(productHtmlService, productProvider, router) {
        this.productHtmlService = productHtmlService;
        this.productProvider = productProvider;
        this.router = router;
    }

    async renderHtml() {
        const productId = this.router.getParamFromUrl("id");
        const product = await this.productProvider.getProductById(productId);
        this.productHtmlService.addProductIntoPage(Product.createProduct({
            id: product._id,
            ...product
        }));
        this.addToCartClickEventListener(product);
    }

    addToCartClickEventListener(product) {
        const saveProductOnClick = e => {
            e.preventDefault();
            try {
                LocalstorageService.addProductToCart({
                    qty: this.productHtmlService.getQty(),
                    color: this.productHtmlService.getColor(),
                    id: product.id
                });
                this.router.goToUrl("./cart.html");
            } catch(error) {
                document.getElementById("errorMsg").textContent = error.message;
            }
        }
        document.getElementById("addToCart").addEventListener("click", saveProductOnClick);
    }
}

const productPage = new ProductPage(new ProductHtmlService(document), new ProductProvider(), new Router())
productPage.renderHtml();