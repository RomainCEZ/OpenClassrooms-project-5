
let totalPrice = 0;
let totalQty = 0;
const keys = listLocalStorageKeys();
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

//list localstorage keys
function listLocalStorageKeys() {
    const keys = Object.keys(localStorage);
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

//create list of product id
function createIdList() {
    let idList = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let product = JSON.parse(localStorage.getItem(key));
        idList.push(product._id);
    }
    return idList;
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
                console.log(key);
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

    const firstNameInput = document.getElementById("firstName");
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    let validFirstName = testText(firstNameInput.value)
    document.getElementById("firstName").addEventListener('change', function checkInput() {
        validFirstName = testText(firstNameInput.value)
        if (!validFirstName) {
            firstNameErrorMsg.innerHTML = "Veuillez saisir un prénom valide."
        } else {
            firstNameErrorMsg.innerHTML = ""
        }
    })

    const lastNameInput = document.getElementById("lastName");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    let validLastName = testText(lastNameInput.value);
    document.getElementById("lastName").addEventListener('change', function checkInput() {
        validLastName = testText(lastNameInput.value);
        if (!validLastName) {
            lastNameErrorMsg.innerHTML = "Veuillez saisir un nom valide."
        } else {
            lastNameErrorMsg.innerHTML = ""
        }
    })

    const addressInput = document.getElementById("address");
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    let validAddress = testAddress(addressInput.value);
    document.getElementById("address").addEventListener('change', function checkInput() {
        validAddress = testAddress(addressInput.value);
        if (!validAddress) {
            addressErrorMsg.innerHTML = "Veuillez saisir une adresse valide."
        } else {
            addressErrorMsg.innerHTML = ""
        }
    })

    const cityInput = document.getElementById("city");
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    let validCity = testText(cityInput.value);
    document.getElementById("city").addEventListener('change', function checkInput() {
        validCity = testText(cityInput.value);
        if (!validCity) {
            cityErrorMsg.innerHTML = "Veuillez saisir une ville valide."
        } else {
            cityErrorMsg.innerHTML = ""
        }
    })

    const emailInput = document.getElementById("email");
    const emailErrorMsg = document.getElementById("emailErrorMsg");
    let validEmail = testEmail(emailInput.value);
    document.getElementById("email").addEventListener('change', function checkInput() {
        validEmail = testEmail(emailInput.value);
        if (!validEmail) {
            emailErrorMsg.innerHTML = "Veuillez saisir une adresse email valide."
        } else {
            emailErrorMsg.innerHTML = ""
        }
    })

    //event listener on #order button
    document.getElementById("order").addEventListener('click', async function clickOrder(e) {
        e.preventDefault();

        validFirstName = testText(firstNameInput.value)
        if (!validFirstName) {
            firstNameErrorMsg.innerHTML = "Veuillez saisir un prénom valide."
        } else {
            firstNameErrorMsg.innerHTML = ""
        }

        validLastName = testText(lastNameInput.value);
        if (!validLastName) {
            lastNameErrorMsg.innerHTML = "Veuillez saisir un nom valide."
        } else {
            lastNameErrorMsg.innerHTML = ""
        }

        validAddress = testAddress(addressInput.value);
        if (!validAddress) {
            addressErrorMsg.innerHTML = "Veuillez saisir une adresse valide."
        } else {
            addressErrorMsg.innerHTML = ""
        }

        validCity = testText(cityInput.value);
        if (!validCity) {
            cityErrorMsg.innerHTML = "Veuillez saisir une ville valide."
        } else {
            cityErrorMsg.innerHTML = ""
        }

        validEmail = testEmail(emailInput.value);
        if (!validEmail) {
            emailErrorMsg.innerHTML = "Veuillez saisir une adresse email valide."
        } else {
            emailErrorMsg.innerHTML = ""
        }
        
        if (validFirstName && validLastName && validAddress && validCity && validEmail) {
            let contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value
            }
            let products = createIdList();
            let order = {contact, products};
            console.log(order);

            let orderResponse = await postOrder(order);
            let orderId = orderResponse.orderId;
            console.log("Order Id : "+orderId);
            window.location= "./confirmation.html?orderId="+orderId;
        }

        });
}

//send order
async function postOrder(order) {
    let response = await fetch("http://localhost:3000/api/products/order", {
	method: "POST",
    headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
        },
	body: JSON.stringify(order)
    });

return response.json();
}

//if confirmation page
if (document.getElementById("orderId")) {
    setOrderId();
}


function testEmail(value) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(value);
}

function testAddress(value) {
    return /^[^\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\/\<\>\=\@\[\]\\\^\_\{\}\|\~]+$/.test(value);
}

function testText(value) {
    return /^[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\/\<\>\=\@\[\]\\\^\_\{\}\|\~]+$/.test(value);
}

//  /^[\s-'A-zÀ-ÖØ-öø-ÿ]+$/ 
//  /^[-'\s\p{L}\p{M}]+$/muig