import ProductProvider from "./modules/ProductProvider.js";
import HtmlService from "./modules/HtmlService.js";
import Product from "./modules/Product.js";
import LocalstorageService from "./modules/LocalStorageService.js";
import FormHandlerService from "./modules/FormHandlerService.js";
import Router from "./modules/Router.js";

class CartPage {
    constructor( htmlService, productProvider, router ) {
        this.htmlService = htmlService;
        this.productProvider = productProvider;
        this.router = router;
    }

    async renderCartPage() {
        await this.setCart();
        this.setForm();
    }

    async setCart() {
        const catalog = await this.productProvider.getAllProducts();
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const productsList = this.createProductsList(catalog, cartProductsList);
        this.renderHtmlProducts(productsList);
        this.updateTotalQtyAndPrice(productsList);
        this.setCartEventListeners(productsList);
    }
    renderHtmlProducts(productsList) {
        const cartFragment = this.htmlService.createFragment(productsList.map( product => product.createCartPageHtmlProduct));
        this.htmlService.insertHtmlElement(cartFragment, "#cart__items")
    }

    forceInputMinMaxValue(inputQuerySelector) {
        if (inputQuerySelector.value < 1) {
            inputQuerySelector.value = 1;
        }
        if (inputQuerySelector.value > 100) {
            inputQuerySelector.value = 100;
        }
    }

    sumReducer(array) {
        const sum = (qty1, qty2) => (Number(qty1) + Number(qty2));
        return array.reduce(sum, 0);
    }

    calculateTotalQty() {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const qtyList = cartProductsList.map( product => product.qty)
        return this.sumReducer(qtyList);
    }

    calculateTotalPrice(productsList) {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const priceList = []
        cartProductsList.forEach( cartProduct => {
            const price = productsList.find( product => product.id === cartProduct.id).price;
            priceList.push(cartProduct.qty * price);
        });
        return this.sumReducer(priceList);
    }

    updateTotalQtyAndPrice(productsList) {
        const totalQuantity = this.calculateTotalQty(productsList);
        this.htmlService.insertTextContent(totalQuantity, "#totalQuantity");
        const totalPrice = this.calculateTotalPrice(productsList);
        this.htmlService.insertTextContent(totalPrice, "#totalPrice");
    }

    createProductsList(catalog, cartProductsList) {
        const productsList = [];
        cartProductsList.forEach( cartProduct => {
            const catalogProduct = catalog.find( product => product._id === cartProduct.id);
            const product = Product.createProduct({ 
                color: cartProduct.color, 
                qty: cartProduct.qty,
                id: catalogProduct._id,
                ...catalogProduct });
            productsList.push(product);
        });
        return productsList;
    }

    setCartEventListeners(productsList) {
        this.setDeleteItemButtonEventListener(productsList);
        this.setQtyInputEventListener(productsList);
    }

    setDeleteItemButtonEventListener(productsList) {
        this.htmlService.getNodeArray(".deleteItem").forEach( deleteItemButton => {
            deleteItemButton.addEventListener('click', e => {
                e.preventDefault();
                const article = deleteItemButton.closest("article");
                document.getElementById("cart__items").removeChild(article);
                LocalstorageService.removeCartProduct(article.dataset.id);
                this.updateTotalQtyAndPrice(productsList);
            })
        })
    }

    setQtyInputEventListener(productsList) {
        this.htmlService.getNodeArray(".itemQuantity").forEach( qtyInput => {
            qtyInput.addEventListener('change', e => {
                e.preventDefault();
                const article = qtyInput.closest("article");
                this.forceInputMinMaxValue(qtyInput);
                LocalstorageService.updateCartProductQty(article.dataset.id, qtyInput.value);
                this.updateTotalQtyAndPrice(productsList);
            })
        })
    }

    setForm() {
        const formInputList = this.htmlService.getNodeArray(".cart__order__form__question > input");
        this.setFormValidation(formInputList);
        this.setOrderButtonClick(formInputList);
    }

    setFormValidation(formInputList) {
        formInputList.forEach( input => {
            input.addEventListener('change', function checkInput() {
                FormHandlerService.testInputValidity(input.id);
            })
        })
    }

    setOrderButtonClick(formInputList) {
        const orderButton = document.getElementById("order");
        orderButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const formIsValid = FormHandlerService.testFormValidity(formInputList);
            if (formIsValid) {
                const contact = {
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    address: document.getElementById("address").value,
                    city: document.getElementById("city").value,
                    email: document.getElementById("email").value
                }
                const cartProductsList = LocalstorageService.getCartProductsArray();
                if (cartProductsList.length > 0) {
                    const products = this.createIdList(cartProductsList);
                    const order = {contact, products};
                    const orderResponse = await this.postOrder(order);
                    const orderId = orderResponse.orderId;
                    this.router.goToUrl(`./confirmation.html?orderId=${orderId}`);
                }
            }
        })
    }

    createIdList(cartProductsList) {
        return cartProductsList.map( cartProduct => cartProduct.id);
    }
    
    async postOrder(order) {
        try {
            const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
                },
            body: JSON.stringify(order)
            });
            return response.json();
        } catch(err) {
            console.log(err);
        }
    }
}

const cartPage = new CartPage( new HtmlService(document), new ProductProvider(), new Router());
cartPage.renderCartPage();
