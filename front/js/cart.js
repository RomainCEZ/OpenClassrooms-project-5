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
    static editFormErrorMsg(validInput, formInputHtmlId) {
        const formInputHtml = document.getElementById(`${formInputHtmlId.id}ErrorMsg`);
        if (!validInput) {
            formInputHtml.innerHTML = "Champ invalide."
        } else {
            formInputHtml.innerHTML = ""
        }
    }
}

class LocalstorageService {
    static updateQty(key, cartProduct) {
        const storedQty = JSON.parse(localStorage.getItem(key)).qty;
        const newQty = storedQty + cartProduct.qty;
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: cartProduct.color,
            product: cartProduct.product
        })
        localStorage.setItem(key, JSON.stringify(updatedCartProduct));
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

let totalPrice = 0;
let totalQty = 0;
const keys = Object.keys(localStorage); //list all localstorage keys

function setCartItem(product) {
    const productHtml = HtmlService.addCartProductToHtml(product);
    document.getElementById("cart__items").innerHTML += productHtml;
}

function setCartItems(keys) {
    for (let key of keys) {
        const storedProduct = JSON.parse(localStorage.getItem(key));
        const product = new Product({ 
            color: storedProduct.color,
            qty: storedProduct.qty,
            product: storedProduct.product
        });
        setCartItem(product);
        calculateTotalPrice(storedProduct.qty, storedProduct.product.price);
    }
}

//calculate total number of items in cart and total price
function calculateTotalPrice(qty, price) {
    totalQty += qty;
    totalPrice += price * qty;
}

//display total qty and total price
function setTotals() {
    document.getElementById("totalQuantity").innerHTML = totalQty;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

function getIdFromUrl() {
    return new URLSearchParams(document.location.search.substring(1)).get("orderId");
}

function displayOrderId() {
    const orderId = getIdFromUrl();
    document.getElementById("orderId").innerHTML = orderId;
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


//if cart page
if (document.getElementById("cart__items")) {
    setCartItems(keys);
    setTotals();

    if (document.getElementsByClassName("deleteItem") && (localStorage)){
        const deleteItemButton = document.getElementsByClassName("deleteItem");
        const cart = document.getElementById("cart__items");

        //add event listener to every delete buttons
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            deleteItemButton[i].addEventListener("click", function deleteItem(e) {
                e.preventDefault();
                //remove product from cart and localstorage
                cart.removeChild(this.closest("article"));
                const price = JSON.parse(localStorage.getItem(key)).product.price;
                const qty = JSON.parse(localStorage.getItem(key)).qty;
                localStorage.removeItem(key);
                calculateTotalPrice(-qty, price);
                setTotals();
            });
        }
    }

    //event listener on quantity input change
    const qtyInput = document.getElementsByClassName("itemQuantity");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        qtyInput[i].addEventListener("change", function changeQty(e) {
            e.preventDefault();
            const product = JSON.parse(localStorage.getItem(key));
            if (this.value < 1) {
                this.value = 1;
            }
            const qtyDifference = this.value - product.qty;
            const price = product.product.price;
            product.qty += qtyDifference;
            localStorage.setItem(key, JSON.stringify(product));
            calculateTotalPrice(qtyDifference, price);
            setTotals();
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

    //event listener on #order button
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

//if confirmation page
if (document.getElementById("orderId")) {
    displayOrderId();
}

function goToUrl(URL) {
    window.location= URL;
}
