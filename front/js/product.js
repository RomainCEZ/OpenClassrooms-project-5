let productId;
let product;
const keys = localStorageKeys();

//get a list of all localstorage keys
function localStorageKeys() {
    const keys = Object.keys(localStorage);
    console.log(`LocalStorage keys : ${keys}`);
    return keys;
}

//get product Id from the page Url and save it to productId variable
function getIdFromUrl() {
    productId = new URLSearchParams(document.location.search.substring(1)).get("id");
    console.log(`Id : ${productId}`);
}

//fetch product from api using productId and return product
async function fetchProduct() {
    const res = await fetch("http://localhost:3000/api/products/"+productId);
    product = await res.json();
    console.table(product);
}

//get productImage and altTxt from product and add them to "item__img"
function addProductImg() {
    const imageUrl = product.imageUrl;
    const altTxt = product.altTxt;
    document.getElementsByClassName("item__img")[0]
        .innerHTML = `<img src="${imageUrl}" alt="${altTxt}">`;
    console.log(`ImageUrl : ${imageUrl} Image altTxt : ${altTxt}`);
}

//get productName from product and add it to "title"
function addProductName() {
    const name = product.name;
    document.getElementById("title")
        .innerHTML = name;
    console.log(`Name : ${name}`);
}

//get productDescription from product and add it to "description"
function addProductDescription() {
    const description = product.description;
    document.getElementById("description")
        .innerHTML = description;
    console.log(`Description : ${description}`);
}

//get productPrice from product and add it to "price"
function addProductPrice() {
    const price = product.price;
    document.getElementById("price")
        .innerHTML = price;
    console.log(`Price : ${price} €`);
}

//get productColors array from product and save it to colors variable
function addProductColors() {
    const colors = product.colors;
    console.table(colors);

    //get each color from colors array and push productColor to the "colors" list
    for (let i in colors) {
        document.getElementById("colors")
            .innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
        console.log(`Color option ${i} : ${colors[i]}`);
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
    console.log(product.color);
}

//add productQty to product object
function saveQty() {
    let qty = Number(document.getElementById("quantity").value);
    product.qty = qty;
    console.log("qty="+product.qty);
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
    console.log(`New key is : ${newKey}`);
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
                console.log(`Product already in cart, key is : ${key}`);
                return key;
            }
        }
        console.log("Product not in cart");
        return false;
    }
    console.log("localstorage empty");
    return false;
}

//save product to localStorage and redirect to cart page
document
    .getElementById("addToCart")
    .addEventListener("click", function saveProduct(e) {
        e.preventDefault();
        saveColor();
        saveQty();
        let isDuplicate = checkDuplicateProduct(product.name, product.color); //returns false or a localstorage key

        if (!isDuplicate) {
            const newKey = generateKey(keys);
            saveNewProduct(newKey);
            console.log(`Add product to localstorage[${newKey}]`);
        } else {
            //function addQty(product.qty, isDuplicate);
            const key = isDuplicate;
            const previousQty = JSON.parse(localStorage.getItem(key)).qty;
            let newQty = Number(document.getElementById("quantity").value);
            console.log(`Previous quantity is : ${previousQty}`);
            product.qty = previousQty + newQty;
            console.log(`New quantity is : ${product.qty}`);
            localStorage.setItem(key, JSON.stringify(product));
        }

        //redirect to url
        window.location= "./cart.html";

});


fillProductPage();
