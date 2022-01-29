import ProductProvider from "./modules/ProductProvider.js";
import Product from "./modules/Product.js";
import LocalstorageService from "./modules/LocalStorageService.js";
import FormHandlerService from "./modules/FormHandlerService.js";
import CartPageHtmlService from "./modules/CartPageHtmlService.js";
import Router from "./modules/Router.js";

class CartPage {
    constructor( cartPageHtmlService, productProvider, router ) {
        this.cartPageHtmlService = cartPageHtmlService;
        this.productProvider = productProvider;
        this.router = router;
    }

    async renderHtml() {
        await this.setCart();
        this.setFormValidation();
        this.setOrderButtonClick();
    }

    async setCart() {
        const catalog = await this.productProvider.getAllProducts();
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const productsList = this.createProductsList(catalog, cartProductsList);
        this.cartPageHtmlService.setCartProducts(productsList);
        this.cartPageHtmlService.updateTotalQtyAndPrice(productsList);
        this.setCartEventListeners(productsList);
    }

    createProductsList(catalog, cartProductsList) {
        const productsList = [];
        cartProductsList.forEach( cartProduct => {
            const catalogProduct = catalog.find( product => product._id === cartProduct.id);
            const product = new Product({ 
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
        const deleteItemButtons = document.getElementsByClassName("deleteItem");
        const cartHtml = document.getElementById("cart__items");

        Array.from(deleteItemButtons).forEach( deleteItemButton => {
            deleteItemButton.addEventListener('click', e => {
                e.preventDefault();
                const article = deleteItemButton.closest("article");
                cartHtml.removeChild(article);
                LocalstorageService.removeCartProduct(article.dataset.id);
                this.cartPageHtmlService.updateTotalQtyAndPrice(productsList);
            })
        })
    }

    setQtyInputEventListener(productsList) {
        const qtyInputs = document.getElementsByClassName("itemQuantity");

        Array.from(qtyInputs).forEach( qtyInput => {
            qtyInput.addEventListener('change', e => {
                e.preventDefault();
                const article = qtyInput.closest("article");
                this.cartPageHtmlService.forceInputMinMaxValue(qtyInput);
                LocalstorageService.updateCartProductQty(article.dataset.id, qtyInput.value);
                this.cartPageHtmlService.updateTotalQtyAndPrice(productsList);
            })
        })
    }

    setFormValidation() {
        const firstNameInputHtml = document.getElementById("firstName");
        firstNameInputHtml.addEventListener('change', function checkInput() {
            FormHandlerService.testNameValidity(firstNameInputHtml);
        })
        const lastNameInputHtml = document.getElementById("lastName");
        lastNameInputHtml.addEventListener('change', function checkInput() {
            FormHandlerService.testNameValidity(lastNameInputHtml);
        })
        const addressInputHtml = document.getElementById("address");
        addressInputHtml.addEventListener('change', function checkInput() {
            FormHandlerService.testAdressValidity(addressInputHtml);
        })
        const cityInputHtml = document.getElementById("city");
        cityInputHtml.addEventListener('change', function checkInput() {
            FormHandlerService.testAdressValidity(cityInputHtml);
        })
        const emailInputHtml = document.getElementById("email");
        emailInputHtml.addEventListener('change', function checkInput() {
            FormHandlerService.testEmailValidity(emailInputHtml);
        })
    }

    setOrderButtonClick() {
        const orderButton = document.getElementById("order");
        orderButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const formIsValid = FormHandlerService.testFormValidity();
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

const cartPage = new CartPage( new CartPageHtmlService(document), new ProductProvider(), new Router());
cartPage.renderHtml();
