class Product {
    constructor ({ id, img, name, description, colors, price }) {
        this.id = id,
        this.img = img,
        this.name = name,
        this.description = description,
        this.colors = colors,
        this.price = price
    }
    static createProduct(product) {
        return new Product(product);
    }
}

class CartProduct {
    constructor ({ qty, color, id}) {
        this.qty = qty,
        this.color = color,
        this.id = id
    }
    static createCartProduct({ qty, color, id}) {
        CartProduct.checkParameters(qty, color);
        return new CartProduct({ qty, color, id});
    }

    static checkParameters(qty, color) {
        if ( color === "") {
            throw new Error("*Veuillez choisir une couleur.*");
        }
        if ( qty < 1 || qty > 100 ) {
            throw new Error("*Veuillez saisir une quantité entre 1 et 100.*");
        }
    }
}

// eslint-disable-next-line no-unused-vars
class ProductHtmlService {
    constructor (document) {
        this.document = document;
    }
    addProductIntoPage(product) {
        this.document.title = `${product.name}`;

        this.document.getElementById("title")
        .innerHTML = `${product.name}`;

        this.document.querySelector(".item__img")
        .innerHTML = `<img src="${product.img.src}" alt="${product.img.alt}">`;
        document.getElementById("description")
            .innerHTML = `${product.description}`;

        this.document.getElementById("price")
        .innerHTML = `${product.price}`;

        product.colors.forEach( color => {
            this.document.getElementById("colors")
                .innerHTML += `<option value="${color}">${color}</option>`;
        })
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

class LocalstorageService {
    static getCartProduct(key) {
        const product = localStorage.getItem(key);
        return product ? JSON.parse(product) : null;
    }

    static saveCartProduct(key, cartProduct) {
        localStorage.setItem(key, JSON.stringify(cartProduct));
    }

    static removeCartProduct(key) {
        localStorage.removeItem(key);
    }
    
    static addProductToCart(cartProduct) {
        const id = cartProduct.id;
        const color = cartProduct.color;
        const key = LocalstorageService.getKey(id, color);
        const storedCartProduct = LocalstorageService.getCartProduct(key);
        if (storedCartProduct) {
            LocalstorageService.updateCartProductWithNewQty(key, storedCartProduct, cartProduct.qty);
        } else {
            LocalstorageService.saveCartProduct(key, cartProduct);
        }
    }

    static getKey(id, color) {
        return `${id}-${color}`;
    }

    static updateCartProductWithNewQty(key, storedCartProduct, qtyToAdd) {
        const storedQty = storedCartProduct.qty;
        const newQty = Number(storedQty) + Number(qtyToAdd);
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: storedCartProduct.color,
            id: storedCartProduct.productId
        })
        LocalstorageService.saveCartProduct(key, updatedCartProduct);
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
        this.productHtmlService.addProductIntoPage(product);
        this.addToCartClickEventListener(product);
    }

    addToCartClickEventListener(product) {
        const saveProductOnClick = e => {
            e.preventDefault();
            try {
                const cartProduct = CartProduct.createCartProduct({
                    qty: this.productHtmlService.getQty(),
                    color: this.productHtmlService.getColor(),
                    id: product.id
                })
                LocalstorageService.addProductToCart(cartProduct);
                this.router.goToUrl("./cart.html");
            } catch(error) {
                document.getElementById("errorMsg").innerHTML = error.message;
            }
        }
        document.getElementById("addToCart").addEventListener("click", saveProductOnClick);
    }
}

// const productPage = new ProductPage(new ProductHtmlService(document), new ProductProvider(), new Router())
// productPage.renderHtml();
