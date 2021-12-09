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

class ProductHtmlService {

}

class FormHandlerService {

}

let totalPrice = 0;
let totalQty = 0;
const keys = Object.keys(localStorage); //list all localstorage keys

function setCartItem(product) {
    document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${product.id}"><div class="cart__item__img"><img src="${product.img.src}" alt="${product.img.alt}"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>${product.name} ( ${product.color} )</h2><p>${product.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
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

//create list of product id
function createIdList() {
    let idList = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const product = JSON.parse(localStorage.getItem(key));
        idList.push(product._id);
    }
    return idList;
}

//send order
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

function setFirstNameErrorMsg(firstNameInput) {
    const validFirstName = testName(firstNameInput.value)
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    if (!validFirstName) {
        firstNameErrorMsg.innerHTML = "Veuillez saisir un prénom valide."
    } else {
        firstNameErrorMsg.innerHTML = ""
    }
    return validFirstName;
}

function setLastNameErrorMsg(lastNameInput) {
    const validLastName = testName(lastNameInput.value);
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    if (!validLastName) {
        lastNameErrorMsg.innerHTML = "Veuillez saisir un nom valide."
    } else {
        lastNameErrorMsg.innerHTML = ""
    }
    return validLastName;
}
        
function setAddressErrorMsg(addressInput) {
    const validAddress = testAddress(addressInput.value);
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    if (!validAddress) {
        addressErrorMsg.innerHTML = "Veuillez saisir une adresse valide."
    } else {
        addressErrorMsg.innerHTML = ""
    }
    return validAddress;
}
        
function setCityErrorMsg(cityInput) {
    const validCity = testAddress(cityInput.value);
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    if (!validCity) {
        cityErrorMsg.innerHTML = "Veuillez saisir une ville valide."
    } else {
        cityErrorMsg.innerHTML = ""
    }
    return validCity;
}
        
function setEmailErrorMsg(emailInput) {
    const validEmail = testEmail(emailInput.value);
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    if (!validEmail) {
        emailErrorMsg.innerHTML = "Veuillez saisir une adresse email valide."
    } else {
        emailErrorMsg.innerHTML = ""
    }
    return validEmail;
}

function testEmail(value) {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(value);
}

function testAddress(value) {
return /^[0-9-'\s\p{L}\p{M}]+$/muig.test(value);
}

//  /^[-'\s\p{L}\p{M}]+$/muig
function testName(value) {
return /^[-'\s\p{L}\p{M}]+$/muig.test(value);
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
                let price = JSON.parse(localStorage.getItem(key)).price;
                let qty = JSON.parse(localStorage.getItem(key)).qty;
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
            const price = product.price;
            product.qty += qtyDifference;
            localStorage.setItem(key, JSON.stringify(product));
            calculateTotalPrice(qtyDifference, price);
            setTotals();
        });
    }

    const firstNameInput = document.getElementById("firstName");
    document.getElementById("firstName").addEventListener('change', function checkInput() {
        setFirstNameErrorMsg(firstNameInput);
    })

    const lastNameInput = document.getElementById("lastName");
    document.getElementById("lastName").addEventListener('change', function checkInput() {
        setLastNameErrorMsg(lastNameInput);
    })

    const addressInput = document.getElementById("address");
    document.getElementById("address").addEventListener('change', function checkInput() {
        setAddressErrorMsg(addressInput);
    })

    const cityInput = document.getElementById("city");
    document.getElementById("city").addEventListener('change', function checkInput() {
        setCityErrorMsg(cityInput);
    })

    const emailInput = document.getElementById("email");
    document.getElementById("email").addEventListener('change', function checkInput() {
        setEmailErrorMsg(emailInput);
    })

    //event listener on #order button
    document.getElementById("order").addEventListener('click', async function clickOrder(e) {
        e.preventDefault();

        //form validation
        const validFirstName = setFirstNameErrorMsg(firstNameInput);
        const validLastName = setLastNameErrorMsg(lastNameInput);
        const validAddress = setAddressErrorMsg(addressInput);
        const validCity = setCityErrorMsg(cityInput);
        const validEmail = setEmailErrorMsg(emailInput);
        
        if (validFirstName && validLastName && validAddress && validCity && validEmail) {
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
