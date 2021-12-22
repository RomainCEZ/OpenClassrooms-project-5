class Product {
    constructor ({ _id, imageUrl, altTxt, name, description }) {
        this.id = _id,
        this.img = {
            src: imageUrl,
            alt: altTxt
        }
        this.name = name,
        this.description = description
    }

    get insertProductIntoHtml() {
        return `<a href="./product.html?id=${this.id}">
                    <article>
                        <img src=${this.img.src} alt=${this.img.alt}/>
                        <h3 class="productName">${this.name}</h3>
                        <p class="productDescription">${this.description}</p>
                    </article>
                </a>`;
    }
}

async function getProductsFromApi() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        const products = await response.json();
        return products;
    } catch(err) {
        console.log(err);
    }
}

function insertProductsIntoHtml(products) {
    const productsList = document.getElementById("items");
    products.forEach( ({ _id, imageUrl, altTxt, name, description }) => {
        const productHtml = new Product({ _id, imageUrl, altTxt, name, description }).insertProductIntoHtml;
        productsList.innerHTML += productHtml;
    })
}

async function fillProductsPage() {
    const products = await getProductsFromApi();
    insertProductsIntoHtml(products);
}
