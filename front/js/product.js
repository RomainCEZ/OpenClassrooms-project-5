let productId;
let product;
const keys = localStorageKeys();

//get a list of all localstorage keys
function localStorageKeys() {
    const keys = Object.keys(localStorage);
    return keys;
}

//get product Id from the page Url and save it to productId variable
function getIdFromUrl() {
    productId = new URLSearchParams(document.location.search.substring(1)).get("id");
}

//fetch product from api using productId
async function fetchProduct() {
    const res = await fetch("http://localhost:3000/api/products/"+productId);
    product = await res.json();
}

//add imageUrl and altTxt
function addProductImg() {
    document.getElementsByClassName("item__img")[0]
        .innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

//add name
function addProductName() {
    document.getElementById("title")
        .innerHTML = product.name;
}

//add description
function addProductDescription() {
    document.getElementById("description")
        .innerHTML = product.description;
}

//add price
function addProductPrice() {
    document.getElementById("price")
        .innerHTML = product.price;
}

//add each color to the "colors" list
function addProductColors() {
    for (let i in product.colors) {
        document.getElementById("colors")
            .innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
    }
}

//get product infos and fill product page
async function fillProductPage() {
    getIdFromUrl();
    await fetchProduct();
    addProductImg();
    addProductName();
    addProductDescription();
    addProductPrice();
    addProductColors();
}

//add productColor to product object
function saveColor() {
    let select = document.getElementById("colors");
    let color = select.options[select.selectedIndex].value;
    product.color = color;
}

//add productQty to product object
function saveQty() {
    let qty = Number(document.getElementById("quantity").value);
    product.qty = qty;
}

//generate a unique newKey from existing localstorage keys
function generateKey(keys) {
    let newKey = 0;
    //if localstorage exists, newKey is the sum of all keys + 1 so we can't overwrite an existing key
    if (localStorage) {
        for (let key of keys) {
            newKey += Number(key) + 1;
        }
    }
    //newKey is 0 if localstorage is empty
    return newKey;
}

//attribute a newKey to product and save it to localStorage
function saveNewProduct(newKey) {
    localStorage.setItem(newKey, JSON.stringify(product));
}

//check if product already exists in localstorage
function checkDuplicateProduct(name, color) {
    if (localStorage.length > 0) {
        for (let key of keys) {
            if ((name === JSON.parse(localStorage.getItem(key)).name) && (color === JSON.parse(localStorage.getItem(key)).color)) {
                return key;
            }
        }
        return false;
    }
    return false;
}

//save product to localStorage and redirect to cart page
document.getElementById("addToCart").addEventListener("click", function saveProduct(e) {
    e.preventDefault();
    saveColor();
    saveQty();
    let newQty = Number(document.getElementById("quantity").value);
    //can only add to cart if quantity is 1 or more and a color is selected
    console.log(product.color);
    if ((newQty > 0) && (product.color != "")){
        let isDuplicate = checkDuplicateProduct(product.name, product.color); //returns false or a localstorage key
        if (!isDuplicate) {
            const newKey = generateKey(keys);
            saveNewProduct(newKey);
        } else {
            //function addQty(product.qty, isDuplicate);
            const key = isDuplicate;
            const previousQty = JSON.parse(localStorage.getItem(key)).qty;
                console.log(`Previous quantity was : ${previousQty}`);
                product.qty = previousQty + newQty;
                console.log(`New quantity is : ${product.qty}`);
                localStorage.setItem(key, JSON.stringify(product));
            }
        //redirect to url
        window.location= "./cart.html";
    }
})

fillProductPage();