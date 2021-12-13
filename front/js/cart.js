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

class HtmlService {
    static addCartProductToHtml(product) {
        return `<article class="cart__item" data-id="${product.id}">
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
        const productHtml = HtmlService.addCartProductToHtml(product);
        document.getElementById("cart__items").innerHTML += productHtml;
    }

    static editFormErrorMsg(validInput, formInputHtmlId) {
        const formInputHtml = document.getElementById(`${formInputHtmlId.id}ErrorMsg`);
        if (!validInput) {
            formInputHtml.innerHTML = "Champ invalide."
        } else {
            formInputHtml.innerHTML = ""
        }
    }

    static setTotalQuantity(totalQuantity) {
        document.getElementById("totalQuantity").innerHTML = totalQuantity;
    }

    static setTotalPrice(totalPrice) {
        document.getElementById("totalPrice").innerHTML = totalPrice;
    }

    static displayOrderId(orderId) {
        document.getElementById("orderId").innerHTML = orderId;
    }

    static forceInputMinValueToOne(inputQuerySelector) {
        if (inputQuerySelector.value < 1) {
            inputQuerySelector.value = 1;
        }
    }
}

class LocalstorageService {
    static getCartProduct(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static saveCartProduct(key, cartProduct) {
        localStorage.setItem(key, JSON.stringify(cartProduct));
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

    static testNameValidity(formInputHtmlId) {
        const validName = FormHandlerService.testName(formInputHtmlId.value);
        HtmlService.editFormErrorMsg(validName, formInputHtmlId);
        return validName;
    }
    
    static testAdressValidity(formInputHtmlId) {
        const validAddress = FormHandlerService.testAddress(formInputHtmlId.value);
        HtmlService.editFormErrorMsg(validAddress, formInputHtmlId);
        return validAddress;
    }
    
    static testEmailValidity(formInputHtmlId) {
        const validEmail = FormHandlerService.testEmail(formInputHtmlId.value);
        HtmlService.editFormErrorMsg(validEmail, formInputHtmlId);
        return validEmail;
    }

    static testFormValidity() {
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



//            //
//            //
// CART PAGE  //
//            //
//            //

//if cart page
if (document.getElementById("cart__items")) {
    const keys = LocalstorageService.getKeysList();
    setCartItems(keys);

    const totalQuantity = calculateTotalQty();
    HtmlService.setTotalQuantity(totalQuantity);

    const totalPrice = calculateTotalPrice();
    HtmlService.setTotalPrice(totalPrice);

    if (document.getElementsByClassName("deleteItem") && (localStorage)){
        const deleteItemButton = document.getElementsByClassName("deleteItem");
        const cartHtml = document.getElementById("cart__items");

        //event listener to every delete buttons
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            deleteItemButton[i].addEventListener("click", function deleteItem(e) {
                e.preventDefault();
                //remove product from cart and localstorage
                cartHtml.removeChild(this.closest("article"));
                localStorage.removeItem(key);

                const totalQuantity = calculateTotalQty();
                HtmlService.setTotalQuantity(totalQuantity);

                const totalPrice = calculateTotalPrice();
                HtmlService.setTotalPrice(totalPrice);
            });
        }
    }

    //event listener on quantity input change
    const qtyInput = document.getElementsByClassName("itemQuantity");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        qtyInput[i].addEventListener("change", function changeQty(e) {
            e.preventDefault();
            HtmlService.forceInputMinValueToOne(this);
            LocalstorageService.updateCartProductQty(key, this.value);

            const totalQuantity = calculateTotalQty();
            HtmlService.setTotalQuantity(totalQuantity);

            const totalPrice = calculateTotalPrice();
            HtmlService.setTotalPrice(totalPrice);
        });
    }

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

    document.getElementById("order").addEventListener('click', async function clickOrder(e) {
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
            const products = createIdList();
            const order = {contact, products};
            const orderResponse = await postOrder(order);
            const orderId = orderResponse.orderId;
            goToUrl(`./confirmation.html?orderId=${orderId}`);
        }
    });
}

function setCartItems(keys) {
    keys.forEach ( key => {
        const cartProduct = LocalstorageService.getCartProduct(key);
        const product = Product.createProduct(cartProduct);
        HtmlService.setCartItem(product);
    })
}

function calculateTotalQty() {
    const keys = LocalstorageService.getKeysList();
    let totalQty = 0;
    for (const key of keys) {
        const qty = LocalstorageService.getProductQty(key);
        totalQty += Number(qty);
    }
    return totalQty;
}

function calculateTotalPrice() {
    const keys = LocalstorageService.getKeysList();
    let totalPrice = 0;
    for (const key of keys) {
        const price = LocalstorageService.getProductPrice(key);
        const qty = LocalstorageService.getProductQty(key);
        totalPrice += (Number(qty) * Number(price));
    }
    return totalPrice;
}

function createIdList() {
    let idList = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const product = JSON.parse(localStorage.getItem(key));
        idList.push(product.product.id);
    }
    return idList;
}

async function postOrder(order) {
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

function goToUrl(URL) {
    window.location= URL;
}



//                   //
//                   //
// CONFIRMATION PAGE //
//                   //
//                   //

//if confirmation page
if (document.getElementById("orderId")) {
    const orderId = getIdFromUrl();
    HtmlService.displayOrderId(orderId);
}

function getOrderIdFromUrl() {
    return new URLSearchParams(document.location.search.substring(1)).get("orderId");
}
