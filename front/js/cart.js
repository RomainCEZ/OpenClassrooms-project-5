let product = JSON.parse(localStorage.getItem("product"));
let _id = product._id
let imageUrl = product.imageUrl;
let altTxt = product.altTxt;
let name = product.name;
let price = product.price;
let color = product.color;
let qty = product.qty;

let totalPrice = 0;
let totalQty = 0;


function setCartItems() {
    document.getElementById("cart__items")
        .innerHTML += `<article class="cart__item" data-id="${_id}"><div class="cart__item__img"><img src="${imageUrl}" alt="${altTxt}"></div><div class="cart__item__content"><div class="cart__item__content__titlePrice"><h2>${name}</h2><p>${price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté : </p><input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}"></div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`;
}

function calculateTotalPrice() {
    totalQty = qty;
    totalPrice = price * qty;
}

function setTotals() {
    calculateTotalPrice();
    document.getElementById("totalQuantity").innerHTML = totalQty;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}


setCartItems();
setTotals();

//clear localStorage ( temporary )
document
    .getElementsByClassName("deleteItem")[0]
    .addEventListener("click", function deleteItem(e) {
        e.preventDefault();
        localStorage.clear();
    });