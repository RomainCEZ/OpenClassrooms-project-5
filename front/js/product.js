let productId;
let product;


//get product Id from the page Url and save it to productId variable
function getIdFromUrl() {
    productId = new URLSearchParams(document.location.search.substring(1)).get("id");
    console.log(productId);
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
    console.log(`${imageUrl}"  "${altTxt}`);
}

//get productName from product and add it to "title"
function addProductName() {
    const name = product.name;
    document.getElementById("title")
        .innerHTML = name;
    console.log(name);
}

//get productDescription from product and add it to "description"
function addProductDescription() {
    const description = product.description;
    document.getElementById("description")
        .innerHTML = description;
    console.log(description);
}

//get productPrice from product and add it to "price"
function addProductPrice() {
    const price = product.price;
    document.getElementById("price")
        .innerHTML = price;
    console.log(price);
}

//get productColors array from product and save it to colors variable
function addProductColors() {
    const colors = product.colors;
    console.table(colors);

    //get each color from colors array and push productColor to the "colors" list
    for (let i in colors) {
        document.getElementById("colors")
            .innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
        console.log(colors[i]);
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
function generateKey() {
    let newKey = 0;
    //if localstorage exists, newKey is the sum of all keys + 1 so we can't overwrite an existing key
    if (localStorage) {
        const keys = Object.keys(localStorage);
        for (let key of keys) {
            newKey += Number(key) + 1;
        }
    }
    //newKey is 0 if localstorage is empty
    console.log(newKey);
    return newKey;
}

//attribute a newKey to product and save it to localStorage
function saveProducts() {
    const newKey = generateKey();
    localStorage.setItem(newKey, JSON.stringify(product));
    console.log(newKey);
}

//save product to localStorage and redirect to cart page
document
    .getElementById("addToCart")
    .addEventListener("click", function saveProduct(e) {
        e.preventDefault();
        saveColor();
        saveQty();
        generateKey();
        saveProducts();
        
        //redirect to url
        window.location= "./cart.html";
    });


fillProductPage();
