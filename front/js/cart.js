class Product {
    constructor ({ color, qty, product }) {
        this.color = color;
        this.qty = qty;
        this.id = product._id;
        this.img = {
            src: product.imageUrl,
            alt: product.altTxt
        };
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
    }
    static createProduct({ color, qty, product }) { 
        return new Product({ color, qty, product });
    }
}

class CartProduct {
    constructor ({ qty, color, id}) {
        this.qty = qty,
        this.color = color,
        this.id = id
    }
    static createCartProduct({ qty, color, id}) {
        return new CartProduct({ qty, color, id});
    }
}

class CartHtmlService {
    constructor (document) {
        this.document = document;
    }
    static addCartProductToHtml(product) {
        const article = document.createElement("article");
        article.className = 'cart__item';
        article.dataset.id = `${product.id}-${product.color}`;
        article.innerHTML = `<div class="cart__item__img">
                                <img src="${product.img.src}" alt="${product.img.alt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${product.name} ( ${product.color} )</h2>
                                    <p>${product.price} €</p></div><div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>`;
        return article;
    }

    setCartProducts(productsList) {
        const cartFragment = new DocumentFragment();
        productsList.forEach( product => {
            const productHtml = CartHtmlService.addCartProductToHtml(product);
            cartFragment.appendChild(productHtml);
        });
        document.getElementById("cart__items").appendChild(cartFragment);
    }

    insertParamValueIntoHtml(paramId, value) {
        this.document.getElementById(paramId).textContent = value;
    }

    static forceInputMinMaxValue(inputQuerySelector) {
        if (inputQuerySelector.value < 1) {
            inputQuerySelector.value = 1;
        }
        if (inputQuerySelector.value > 100) {
            inputQuerySelector.value = 100;
        }
    }

    static sumReducer(array) {
        const sum = (qty1, qty2) => (Number(qty1) + Number(qty2));
        return array.reduce(sum, 0);
    }

    calculateTotalQty() {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const qtyList = cartProductsList.map( product => product.qty)
        return CartHtmlService.sumReducer(qtyList);
    }
    
    calculateTotalPrice(productsList) {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const priceList = []
        cartProductsList.forEach( cartProduct => {
            const price = productsList.find( product => product.id === cartProduct.id).price;
            priceList.push(cartProduct.qty * price);
        });
        return CartHtmlService.sumReducer(priceList);
    }

    updateTotalQtyAndPrice(productsList) {
        const totalQuantity = this.calculateTotalQty(productsList);
        this.insertParamValueIntoHtml("totalQuantity", totalQuantity);
        const totalPrice = this.calculateTotalPrice(productsList);
        this.insertParamValueIntoHtml("totalPrice", totalPrice);
    }
}

class LocalstorageService {
    static getCartProduct(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static saveCartProduct(key, cartProduct) {
        localStorage.setItem(key, JSON.stringify(cartProduct));
    }

    static removeCartProduct(key) {
        localStorage.removeItem(key);
    }

    static getCartProductsArray() {
        const cartProductsList = Object.values(localStorage);
        return cartProductsList.map( cartProduct => JSON.parse(cartProduct));
    }

    static updateCartProductQty(key, newQty) {
        const cartProduct = LocalstorageService.getCartProduct(key);
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: cartProduct.color,
            id: cartProduct.id
        })
        LocalstorageService.saveCartProduct(key, updatedCartProduct);
    }

    static getProductQty(key) {
        const qty = JSON.parse(localStorage.getItem(key)).qty;
        return qty;
    }

    static getProductPrice(key) {
        const price = JSON.parse(localStorage.getItem(key)).product.price;
        return price;
    }
}

class FormHandlerService {
    static testEmailRegEx(string) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(string);
    }
    
    static testAddressRegEx(string) {
        return /^[0-9-'\s\p{L}\p{M}]+$/muig.test(string);
    }
    
    static testNameRegEx(string) {
        return /^[-'\s\p{L}\p{M}]+$/muig.test(string);
    }

    static editFormErrorMsg(validInput, formInputHtmlId) {
        const formInputHtml = document.getElementById(`${formInputHtmlId.id}ErrorMsg`);
        if (!validInput) {
            formInputHtml.textContent = "*Champ invalide.*"
        } else {
            formInputHtml.textContent = ""
        }
    }

    static testNameValidity(formInputHtmlId) {
        const validName = FormHandlerService.testNameRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validName, formInputHtmlId);
        return validName;
    }
    
    static testAdressValidity(formInputHtmlId) {
        const validAddress = FormHandlerService.testAddressRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validAddress, formInputHtmlId);
        return validAddress;
    }
    
    static testEmailValidity(formInputHtmlId) {
        const validEmail = FormHandlerService.testEmailRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validEmail, formInputHtmlId);
        return validEmail;
    }

    testFormValidity() {
        const firstNameInputHtml = document.getElementById("firstName");
        const validFirstName = FormHandlerService.testNameValidity(firstNameInputHtml);
        const lastNameInputHtml = document.getElementById("lastName");
        const validLastName = FormHandlerService.testNameValidity(lastNameInputHtml);
        const addressInputHtml = document.getElementById("address");
        const validAddress = FormHandlerService.testAdressValidity(addressInputHtml);
        const cityInputHtml = document.getElementById("city");
        const validCity = FormHandlerService.testAdressValidity(cityInputHtml);
        const emailInputHtml = document.getElementById("email");
        const validEmail = FormHandlerService.testEmailValidity(emailInputHtml);
        if (validFirstName && validLastName && validAddress && validCity && validEmail) {
            return true;
        }
    }
}


// eslint-disable-next-line no-unused-vars
class CartPage {
    constructor( cartHtmlService, formHandlerService, productProvider, router ) {
        this.cartHtmlService = cartHtmlService;
        this.formHandlerService = formHandlerService;
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
        this.cartHtmlService.setCartProducts(productsList);
        this.cartHtmlService.updateTotalQtyAndPrice(productsList);
        this.setCartEventListeners(productsList);
    }

    createProductsList(catalog, cartProductsList) {
        const productsList = [];
        cartProductsList.forEach( cartProduct => {
            const catalogProduct = catalog.find( product => product._id === cartProduct.id);
            const product = new Product({ color: cartProduct.color, qty: cartProduct.qty, product: catalogProduct });
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
                this.cartHtmlService.updateTotalQtyAndPrice(productsList);
            })
        })
    }

    setQtyInputEventListener(productsList) {
        const qtyInputs = document.getElementsByClassName("itemQuantity");

        Array.from(qtyInputs).forEach( qtyInput => {
            qtyInput.addEventListener('change', e => {
                e.preventDefault();
                const article = qtyInput.closest("article");
                CartHtmlService.forceInputMinMaxValue(qtyInput);
                LocalstorageService.updateCartProductQty(article.dataset.id, qtyInput.value);
                this.cartHtmlService.updateTotalQtyAndPrice(productsList);
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
            const formIsValid = this.formHandlerService.testFormValidity();
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


// eslint-disable-next-line no-unused-vars
class ConfirmationPage {
    constructor( router ) {
        this.router = router
    }

    renderHtml() {
        const orderId = this.router.getParamFromUrl("orderId");
        this.displayOrderId(orderId);
    }

    displayOrderId(orderId) {
        document.getElementById("orderId").textContent = orderId;
    }
}