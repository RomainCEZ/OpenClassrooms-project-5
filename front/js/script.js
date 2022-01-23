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

    get createHtmlElement() {
        const a = document.createElement('a');
        a.href = `./product.html?id=${this.id}`;
        a.innerHTML =  `<article>
                            <img src=${this.img.src} alt=${this.img.alt}/>
                            <h3 class="productName">${this.name}</h3>
                            <p class="productDescription">${this.description}</p>
                        </article>`;
        return a;
    }
}

class IndexPage {
    constructor(productProvider, router) {
        this.productProvider = productProvider;
        this.router = router;
    }

    async renderHtml() {
        const products = await this.productProvider.getAllProducts();
        this.insertProductsIntoHtml(products);
    }
    insertProductsIntoHtml(products) {
        const productsList = document.querySelector("#items");
        const fragment = new DocumentFragment();
        products.forEach( ({ _id, imageUrl, altTxt, name, description }) => {
            const productHtml = new Product({ _id, imageUrl, altTxt, name, description }).createHtmlElement;
            fragment.appendChild(productHtml);
        })
        productsList.appendChild(fragment);
    }
}
