
let totalPrice = 0;
let totalQty = 0;
const keys = localStorageKeys();
function setCartItem(product) {
    document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${product._id}"><div class="cart__item__img"><img src="${product.imageUrl}" alt="${product.altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>${product.name} ( ${product.color} )</h2><p>${product.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
}

function setCartItems(keys) {
    for (let key of keys) {
        let product = JSON.parse(localStorage.getItem(key));
        console.log(product);
        setCartItem(product);
        calculateTotalPrice(product.qty, product.price);
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

function localStorageKeys() {
    const keys = Object.keys(localStorage);
    console.log(keys);
    return keys;
}

function getIdFromUrl() {
    orderId = new URLSearchParams(document.location.search.substring(1)).get("orderId");
    console.log(`Id : ${orderId}`);
}

function setOrderId() {
    getIdFromUrl();
    document.getElementById("orderId").innerHTML = orderId;
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
            cart.removeChild(this.closest("article")); //parentNode.parentNode.parentNode.parentNode
            let price = JSON.parse(localStorage.getItem(key)).price;
            let qty = JSON.parse(localStorage.getItem(key)).qty;
            console.log(key);
            localStorage.removeItem(key);
            calculateTotalPrice(-qty, price);
            setTotals();
        });
    }
}

const qtyInput = document.getElementsByClassName("itemQuantity");
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    qtyInput[i].addEventListener("change", function changeQty(e) {
        e.preventDefault();
        const product = JSON.parse(localStorage.getItem(key));
        let previousQty = product.qty;
        let newQty = this.value;
        let qtyDifference = newQty - previousQty;
        let price = product.price;
        console.log(`Previous quantity was : ${previousQty}`);
        product.qty += qtyDifference;
        console.log(`New quantity is : ${newQty}`);
        localStorage.setItem(key, JSON.stringify(product));
        calculateTotalPrice(qtyDifference, price);
        setTotals();
    });
}


let contact = {
    firstName: "romain",
    lastName: "cezerac",
    address: "ici",
    city: "la",
    email: "hercez92@hotmail.fr"
}
let products = ["107fb5b75607497b96722bda5b504926"];
let order = {contact, products};
let orderId;
console.log(contact);
console.log(products);
console.log(order);

document.getElementById("order").addEventListener('click', async function postOrder(e) {
e.preventDefault();
//send order 
let response = await fetch("http://localhost:3000/api/products/order", {
	method: "POST",
    headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },        
	body: JSON.stringify(order)
    });
orderResponse = await response.json();
orderId = orderResponse.orderId;
console.log("Order Id : "+orderId);
window.location= "./confirmation.html?orderId="+orderId;
});
}


//if confirmation page
if (document.getElementById("orderId")) {
    setOrderId();
}

//email   /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
//names   /[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\[\]\\\^\_\{\}\|\~]+/