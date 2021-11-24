let catalog = [];


async function fetchCatalog() {
    //gets catalog from api and save it to catalog variable
    var response = await fetch("http://localhost:3000/api/products");
    catalog = await response.json();
    console.table(catalog);

    //parse catalog and add products to the items section
    for (let i in catalog) {
        var altTxt = catalog[i].altTxt;
        var description = catalog[i].description;
        var imageUrl = catalog[i].imageUrl;
        var name = catalog[i].name;
        var _id = catalog[i]._id;
        var item = `<a href="./product.html?id=${_id}"><article><img src=${imageUrl} alt=${altTxt}/><h3 class="productName">${name}</h3><p class="productDescription">${description}</p></article></a>`;
        var itemsList = document.getElementById("items");
        itemsList.innerHTML += item;
    }
}

fetchCatalog();
