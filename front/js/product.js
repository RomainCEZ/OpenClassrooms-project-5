class Product {
    constructor ({ _id, imageUrl, altTxt, name, description, colors, price }) {
        this.id = _id,
        this.src = imageUrl,
        this.alt = altTxt,
        this.name = name,
        this.description = description,
        this.colors = colors,
        this.price = price
    }

    get addProductImgToHtml() {
        document.querySelector(".item__img")
        .innerHTML = `<img src="${this.src}" alt="${this.alt}">`;
    }

    get addProductNameToHtml() {
        document.getElementById("title")
            .innerHTML = `${this.name}`;
    }

    get addProductDescriptionToHtml() {
        document.getElementById("description")
            .innerHTML = `${this.description}`;
    }

    get addProductPriceToHtml() {
        document.getElementById("price")
            .innerHTML = `${this.price}`;
    }

    get addProductColorsToHtml() {
        this.colors.forEach( color => {
            document.getElementById("colors")
                .innerHTML += `<option value="${color}">${color}</option>`;
        })
    }
}

//array of all localstorage keys
const keys = Object.keys(localStorage);

fillProductPage();

//save product to localStorage and redirect to cart page
document.getElementById("addToCart").addEventListener("click", function saveProduct(e) {
    e.preventDefault();
    saveColor();
    saveQty();
    let newQty = Number(document.getElementById("quantity").value);
    //can only add to cart if quantity is 1 or more and a color is selected
    if ((newQty > 0) && (product.color != "")){
        let isDuplicate = checkDuplicateProduct(product.name, product.color); 
        if (!isDuplicate) {
            const newKey = generateKey(keys);
            saveNewProduct(newKey);
        } else {
            //function addQty(product.qty, isDuplicate);
            const key = isDuplicate;
            const previousQty = JSON.parse(localStorage.getItem(key)).qty;
            product.qty = previousQty + newQty;
            localStorage.setItem(key, JSON.stringify(product));
            }
        //redirect to url
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
    const res = await fetch(`http://localhost:3000/api/products/${productId}`);
    product = await res.json();
    return product;
}

//get product infos and fill product page
async function fillProductPage() {
    const productId = getIdFromUrl();
    const product = await getProductFromApi(productId);
    new Product(product).addProductImgToHtml;
    new Product(product).addProductNameToHtml;
    new Product(product).addProductDescriptionToHtml;
    new Product(product).addProductPriceToHtml;
    new Product(product).addProductColorsToHtml;
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
    //if localstorage exists, newKey is the sum of all keys + 1 so we can't overwrite an existing key
    let newKey = 0;
    if (localStorage) {
        keys.forEach( key => {
            newKey += Number(key) + 1;
        })
        return newKey;
    }
    return 0;
}

//attribute a newKey to product and save it to localStorage
function saveNewProduct(newKey) {
    localStorage.setItem(newKey, JSON.stringify(product));
}

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