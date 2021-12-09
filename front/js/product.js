class Product {
    constructor ({ id, img, name, description, colors, price }) {
        this.id = id,
        this.img = img,
        this.name = name,
        this.description = description,
        this.colors = colors,
        this.price = price
    }
    static createProduct(product) {
        return new Product(product);
    }
}

class CartProduct {
    constructor ({ qty, color, product}) {
        this.qty = qty,
        this.color = color,
        this.product = product
    }
    static createCartProduct({ qty, color, product}) {
        return new CartProduct({ qty, color, product});
    }
}

class ProductHtmlService {
    static addProductNameToHtml(productName) {
        document.getElementById("title")
            .innerHTML = `${productName}`;
    }

    static addProductImgToHtml({productImgSrc, productImgAlt}) {
        document.querySelector(".item__img")
        .innerHTML = `<img src="${productImgSrc}" alt="${productImgAlt}">`;
    }

    static addProductDescriptionToHtml(productDescription) {
        document.getElementById("description")
            .innerHTML = `${productDescription}`;
    }

    static addProductPriceToHtml(productPrice) {
        document.getElementById("price")
            .innerHTML = `${productPrice}`;
    }

    static addProductColorsToHtml(productColors) {
        productColors.forEach( color => {
            document.getElementById("colors")
                .innerHTML += `<option value="${color}">${color}</option>`;
        })
    }
}

class LocalstorageService {
    static tempSave(product) {
        localStorage.setItem("tempSave", JSON.stringify(product));
    }

    static saveToCart(cartProduct) {
        const keys = Object.keys(localStorage);
        const id = cartProduct.product.id;
        const color = cartProduct.color;
        const qty = cartProduct.qty;

        //return the localstorage key if product is already in cart
        const productIsAlreadyInCart = LocalstorageService.checkIfProductIsAlreadyInCart(keys, id, color);

        if (!productIsAlreadyInCart) {
            const key = LocalstorageService.generateKey(keys);
            localStorage.setItem(key, JSON.stringify(cartProduct));
        } else {
            LocalstorageService.addQty(productIsAlreadyInCart, cartProduct);
        }
    }

    static checkIfProductIsAlreadyInCart(keys, id, color) {
        if (localStorage.length > 0) {
            for (const key of keys) {
                if ((id === JSON.parse(localStorage.getItem(key)).product.id) && (color === JSON.parse(localStorage.getItem(key)).color)) {
                    return key;
                }
            }
        }
        return false;
    }

    static generateKey(keys) {
    //new key is the sum of all keys + 1
        if (localStorage.length > 0) {
            const sum = (key1, key2) => Number(key1) + Number(key2);
            return Number(keys.reduce(sum) + 1);
        }
        return 0;
    }

    static addQty(key, cartProduct) {
        const storedQty = JSON.parse(localStorage.getItem(key)).qty;
        const newQty = storedQty + cartProduct.qty;
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: cartProduct.color,
            product: cartProduct.product
        })
        console.log(updatedCartProduct);
        localStorage.setItem(key, JSON.stringify(updatedCartProduct));
    }

    static getTempSave() {
        const product = JSON.parse(localStorage.getItem("tempSave"));
        localStorage.removeItem("tempSave");
        return product;
    }
}

fillProductPage();

//save product to localStorage and redirect to cart page
document.getElementById("addToCart").addEventListener("click", function saveProduct(e) {
    e.preventDefault();
    const cartProduct = CartProduct.createCartProduct({
        qty: getQty(),
        color: getColor(),
        product: LocalstorageService.getTempSave()
    })
    console.log(cartProduct.color);
    console.log(cartProduct.qty);
    if (cartProduct.color != "") {
    LocalstorageService.saveToCart(cartProduct);

    window.location= "./cart.html";
    }
})

//get product Id from the page Url and save it to productId variable
function getIdFromUrl() {
    const productId = new URLSearchParams(document.location.search.substring(1)).get("id");
    return productId;
}

//get product from api
async function getProductFromApi(productId) {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        product = await res.json();
        return product;
    } catch(err) {
        console.log(err);
    }
}

// get product infos and fill product page
async function fillProductPage() {
    const productId = getIdFromUrl();
    const { _id, imageUrl, altTxt, name, description, colors, price } = await getProductFromApi(productId);
    const productModel = Product.createProduct({
        id: _id,
        img: {
            src: imageUrl,
            alt: altTxt
        },
        name,
        description,
        colors,
        price
    });
    ProductHtmlService.addProductImgToHtml({productImgSrc: productModel.img.src, productImgAlt: productModel.img.alt});
    ProductHtmlService.addProductNameToHtml(productModel.name);
    ProductHtmlService.addProductDescriptionToHtml(productModel.description);
    ProductHtmlService.addProductPriceToHtml(productModel.price);
    ProductHtmlService.addProductColorsToHtml(productModel.colors);
    LocalstorageService.tempSave(productModel);
    setMinQtyToOne();
}

function getColor() {
    const colorsSelect = document.getElementById("colors");
    const colorOption = colorsSelect.options[colorsSelect.selectedIndex];
    return colorOption.value;
}

function getQty() {
    const qtyInput = document.getElementById("quantity");
    return Number(qtyInput.value);
}

function setMinQtyToOne() {
    const qtyInput = document.getElementById("quantity");
    if (qtyInput.value < 1) {
        qtyInput.value = 1;
    }

    qtyInput.addEventListener("change", function forceMinQtyToOne(e) {
        e.preventDefault();
        if (this.value < 1) {
            this.value = 1;
        }
    })
}