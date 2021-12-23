class Product {
    constructor ({ color, qty, product }) {
        this.color = color,
        this.qty = qty
        this.id = product.id,
        this.img = product.img,
        this.name = product.name,
        this.description = product.description,
        this.price = product.price
    }
    static createProduct({ color, qty, product }) { 
        return new Product({ color, qty, product });
    }
}

class CartProduct {
    constructor ({ qty, color, product}) {
        this.qty = qty,
        this.color = color,
        this.product = product
    }
    static createCartProduct({ qty, color, product}) {
        return new CartProduct({ qty, color, product});
    }
}

class CartHtmlService {
    constructor (document) {
        this.document = document;
    }
    static addCartProductToHtml(product) {
        return `<article class="cart__item" data-id="${product.id}-${product.color}">
                    <div class="cart__item__img">
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
                    </div>
                </article>`
    }

    static setCartItem(product) {
        const productHtml = CartHtmlService.addCartProductToHtml(product);
        document.getElementById("cart__items").innerHTML += productHtml;
    }

    static setCartItems(keys) {
        keys.forEach ( key => {
            const cartProduct = LocalstorageService.getCartProduct(key);
            const product = Product.createProduct(cartProduct);
            CartHtmlService.setCartItem(product);
        })
    }

    setTotalQuantity(totalQuantity) {
        this.document.getElementById("totalQuantity").innerHTML = totalQuantity;
    }

    setTotalPrice(totalPrice) {
        this.document.getElementById("totalPrice").innerHTML = totalPrice;
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
        // const keys = LocalstorageService.getKeysList();
        // let totalQty = 0;
        // keys.forEach( key => {
        //     const qty = LocalstorageService.getProductQty(key);
        //     totalQty += Number(qty);
        // })
        // return totalQty;
        const qtyList = [];
        const keys = LocalstorageService.getKeysList();
        keys.forEach( key => {
            const qty = LocalstorageService.getProductQty(key);
            qtyList.push(qty);
        })
        return CartHtmlService.sumReducer(qtyList);;
    }
    
    calculateTotalPrice() {
        // const keys = LocalstorageService.getKeysList();
        // let totalPrice = 0;
        // keys.forEach( key => {
        //     const price = LocalstorageService.getProductPrice(key);
        //     const qty = LocalstorageService.getProductQty(key);
        //     totalPrice += (Number(qty) * Number(price));
        // })
        // return totalPrice;
        const priceList = [];
        const keys = LocalstorageService.getKeysList();
        keys.forEach( key => {
            const qty = LocalstorageService.getProductQty(key);
            const price = LocalstorageService.getProductPrice(key);
            priceList.push(qty*price);
        })
        return CartHtmlService.sumReducer(priceList);;

    }

    updateTotalQtyAndPrice() {
        const totalQuantity = this.calculateTotalQty();
        this.setTotalQuantity(totalQuantity);
        const totalPrice = this.calculateTotalPrice();
        this.setTotalPrice(totalPrice);
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

    static updateCartProductQty(key, newQty) {
        const cartProduct = LocalstorageService.getCartProduct(key);
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: cartProduct.color,
            product: cartProduct.product
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

    static getKeysList() {
        const keys = Object.keys(localStorage);
        return keys
    }
}

class FormHandlerService {
    static testEmail(string) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(string);
    }
    
    static testAddress(string) {
        return /^[0-9-'\s\p{L}\p{M}]+$/muig.test(string);
    }
    
    static testName(string) {
        return /^[-'\s\p{L}\p{M}]+$/muig.test(string);
    }

    static editFormErrorMsg(validInput, formInputHtmlId) {
        const formInputHtml = document.getElementById(`${formInputHtmlId.id}ErrorMsg`);
        if (!validInput) {
            formInputHtml.innerHTML = "*Champ invalide.*"
        } else {
            formInputHtml.innerHTML = ""
        }
    }

    static testNameValidity(formInputHtmlId) {
        const validName = FormHandlerService.testName(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validName, formInputHtmlId);
        return validName;
    }
    
    static testAdressValidity(formInputHtmlId) {
        const validAddress = FormHandlerService.testAddress(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validAddress, formInputHtmlId);
        return validAddress;
    }
    
    static testEmailValidity(formInputHtmlId) {
        const validEmail = FormHandlerService.testEmail(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validEmail, formInputHtmlId);
        return validEmail;
    }

    testFormValidity() {
        const validFirstName = FormHandlerService.testNameValidity(firstName);
        const validLastName = FormHandlerService.testNameValidity(lastName);
        const validAddress = FormHandlerService.testAdressValidity(address);
        const validCity = FormHandlerService.testAdressValidity(city);
        const validEmail = FormHandlerService.testEmailValidity(email);
        if (validFirstName && validLastName && validAddress && validCity && validEmail) {
            return true;
        }
    }
}


class CartPage {
    constructor( cartHtmlService, formHandlerService, router ) {
        this.cartHtmlService = cartHtmlService,
        this.formHandlerService = formHandlerService,
        this.router = router
    }

    renderHtml() {
        this.setCartProducts();
        this.setFormValidation();
        this.setOrderButtonClick();
    }

    setCartProducts() {
        const keys = LocalstorageService.getKeysList();
        CartHtmlService.setCartItems(keys);
        this.cartHtmlService.updateTotalQtyAndPrice();
        this.setCartEventListeners();
    }

    setCartEventListeners() {
        const deleteItemButtons = document.getElementsByClassName("deleteItem");
        const cartHtml = document.getElementById("cart__items");
        // const cartPage = this;
        // //event listener to every delete buttons
        // for (let i = 0; i < localStorage.length; i++) {
        //     const key = localStorage.key(i);
        //     deleteItemButton[i].addEventListener("click", function deleteItemOnClick(e) {
        //         e.preventDefault();
        //         //remove product from cart and localstorage
        //         cartHtml.removeChild(this.closest("article"));
        //         LocalstorageService.removeCartProduct(key);
        //         cartPage.updateTotalQtyAndPrice();
        //     });

        Array.from(deleteItemButtons).forEach( deleteItemButton => {
            deleteItemButton.addEventListener('click', e => {
                e.preventDefault();
                const article = deleteItemButton.closest("article");
                cartHtml.removeChild(article);
                LocalstorageService.removeCartProduct(article.dataset.id);
                this.cartHtmlService.updateTotalQtyAndPrice();
            })
        })

        const qtyInputs = document.getElementsByClassName("itemQuantity");
        // for (let i = 0; i < localStorage.length; i++) {
        //     const key = localStorage.key(i);
        //     qtyInput[i].addEventListener("change", function changeQty(e) {
        //         e.preventDefault();
        //         HtmlService.forceInputMinMaxValue(this);
        //         LocalstorageService.updateCartProductQty(key, this.value);
        //         cartPage.updateTotalQtyAndPrice();
        //     });
        // }

        Array.from(qtyInputs).forEach( qtyInput => {
            qtyInput.addEventListener('change', e => {
                e.preventDefault();
                const article = qtyInput.closest("article");
                CartHtmlService.forceInputMinMaxValue(qtyInput.value);
                LocalstorageService.updateCartProductQty(article.dataset.id, qtyInput.value);
                this.cartHtmlService.updateTotalQtyAndPrice();
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
                try {
                    const products = this.createIdList();
                    const order = {contact, products};
                    const orderResponse = await this.postOrder(order);
                    const orderId = orderResponse.orderId;
                    this.router.goToUrl(`./confirmation.html?orderId=${orderId}`);
                } catch(error) {
                    document.getElementById(`emailErrorMsg`).innerHTML = error.message;
                }
            }
        })
    }

    createIdList() {
        const idList = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const product = LocalstorageService.getCartProduct(key);
            idList.push(product.product.id);
        }
        if (idList.length == 0) {
            throw new Error("*Votre panier est vide*")
        }
        return idList;
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


class ConfirmationPage {
    constructor( router ) {
        this.router = router
    }

    renderHtml() {
        const orderId = this.router.getParamFromUrl("orderId");
        this.displayOrderId(orderId);
    }

    displayOrderId(orderId) {
        document.getElementById("orderId").innerHTML = orderId;
    }
}