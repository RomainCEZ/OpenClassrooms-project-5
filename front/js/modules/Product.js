export default class Product {
    constructor ({ color = null, qty = null, id, imageUrl, altTxt, name, description, colors, price }) {
        this.color = color;
        this.qty = qty;
        this.id = id;
        this.img = {
            src: imageUrl,
            alt: altTxt
        };
        this.name = name;
        this.description = description;
        this.colors = colors;
        this.price = price;
    }

    static createProduct(product) {
        return new Product(product);
    }

    get createIndexPageHtmlProduct() {
        const a = document.createElement('a');
        a.href = `./product.html?id=${this.id}`;
        a.innerHTML =  
            `<article>
                <img src=${this.img.src} alt=${this.img.alt}/>
                <h3 class="productName">${this.name}</h3>
                <p class="productDescription">${this.description}</p>
            </article>`;
        return a;
    }

    get createColorOptionsFragment() {
        const colorOptions = new DocumentFragment();
        this.colors.forEach( color => {
            const colorOption = document.createElement("option");
            colorOption.value = color;
            colorOption.textContent = color;
            colorOptions.appendChild(colorOption);
        })
        return colorOptions;
    }

    get createCartPageHtmlProduct() {
        const article = document.createElement("article");
        article.className = 'cart__item';
        article.dataset.id = `${this.id}-${this.color}`;
        article.innerHTML = 
            `<div class="cart__item__img">
                <img src="${this.img.src}" alt="${this.img.alt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                    <h2>${this.name} ( ${this.color} )</h2>
                    <p>${this.price} €</p></div><div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${this.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>`;
        return article;
    }
}