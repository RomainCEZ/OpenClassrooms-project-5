
let totalPrice = 0;
let totalQty = 0;


function setCartItem() {
    document.getElementById("cart__items")
        .innerHTML += `<article class="cart__item" data-id="${_id}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>${name} ( ${color} )</h2><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
}

function setCartItems() {
    const keys = localStorageKeys();

    for (let key of keys) {
        let product = JSON.parse(localStorage.getItem(key));
        console.table(product);
        let _id = product._id;
        let imageUrl = product.imageUrl;
        let altTxt = product.altTxt;
        let name = product.name;
        let price = product.price;
        let color = product.color;
        let qty = product.qty;

        document.getElementById("cart__items")
        .innerHTML += `<article class="cart__item" data-id="${_id}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>${name} ( ${color} )</h2><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
        calculateTotalPrice(qty, price);
    }
}

//calculate total number of items in cart and total price
function calculateTotalPrice(qty, price) {
    totalQty += qty;
    totalPrice += price * qty;
}

function setTotals() {
    
    document.getElementById("totalQuantity").innerHTML = totalQty;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

function localStorageKeys() {
    const keys = Object.keys(localStorage);
    console.log(keys);
    return keys;
}

setCartItems();
setTotals();



//clear localStorage on click if cart is not empty
if (document.getElementsByClassName("deleteItem").length > 0) {
    document
        .getElementsByClassName("deleteItem")[0]
        .addEventListener("click", function deleteItem(e) {
            e.preventDefault();
            localStorage.clear();
        });

    }
