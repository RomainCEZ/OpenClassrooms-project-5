
//gets products from api
async function fetchProducts() {
    let response = await fetch("http://localhost:3000/api/products");
    products = await response.json();
    console.table(products);
}

//parse products and add them to the products page
function setProducts() {
    const productsList = document.getElementById("items");
    for (let i in products) {
        const product = `<a href="./product.html?id=${products[i]._id}"><article><img src=${products[i].imageUrl} alt=${products[i].altTxt}/><h3 class="productName">${products[i].name}</h3><p class="productDescription">${products[i].description}</p></article></a>`;
        productsList.innerHTML += product;
    }
}

async function fillProductsPage() {
    let products = await fetchProducts();
    setProducts();
}

fillProductsPage();
