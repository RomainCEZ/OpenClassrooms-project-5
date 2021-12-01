class product {
    constructor ({ _id, imageUrl, altTxt, name, description }) {
        this.id = _id,
        this.src = imageUrl,
        this.alt = altTxt,
        this.name = name,
        this.description = description
    }

    get insertDataIntoProductHtml() {
        const productHtml = `
            <a href="./product.html?id=${this.id}">
                <article><img src=${this.src} alt=${this.alt}/>
                    <h3 class="productName">${this.name}</h3>
                    <p class="productDescription">${this.description}</p>
                </article>
            </a>`;
        return productHtml;
    }
}

async function getProductsFromApi() {
    const response = await fetch("http://localhost:3000/api/products");
    products = await response.json();
    return products;
}

function insertProductsIntoHtml() {
    const productsList = document.getElementById("items");
    products.forEach( products => {
        const productHtml = new product(products).insertDataIntoProductHtml;
        productsList.innerHTML += productHtml;
    })
}

async function fillProductsPage() {
    const products = await getProductsFromApi();
    insertProductsIntoHtml();
}

fillProductsPage();
