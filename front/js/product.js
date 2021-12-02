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
    const qty = document.getElementById("quantity");
    //can only add to cart if quantity is 1 or more and a color is selected
    if ((Number(qty.value) > 0) && (product.color != "")){
        const isDuplicate = checkDuplicateProduct(product.name, product.color); 
        if (!isDuplicate) {
            const newKey = generateKey(keys);
            saveNewProduct(newKey);
        } else {
            //function addQty(product.qty, isDuplicate);
            const key = isDuplicate;
            const storedQty = JSON.parse(localStorage.getItem(key)).qty;
            product.qty = storedQty + (Number(qty.value));
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
    try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`);
        product = await res.json();
        return product;
    } catch(err) {
        console.log(err);
    }
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
    const select = document.getElementById("colors");
    const color = select.options[select.selectedIndex];
    product.color = color.value;
}

//add productQty to product object
function saveQty() {
    const qty = document.getElementById("quantity");
    product.qty = Number(qty.value);
}


//generate a unique newKey from existing localstorage keys
function generateKey(keys) {
    //if localstorage exists, newKey is the sum of all keys + 1 so we can't overwrite an existing key
    if (localStorage) {
        const reducer = (key1, key2) => Number(key1) + Number(key2);
        return keys.reduce(reducer);
        
    }
    return 0;
}

//attribute a newKey to product and save it to localStorage
function saveNewProduct(newKey) {
    localStorage.setItem(newKey, JSON.stringify(product));
}

function checkDuplicateProduct(name, color) {
    if (localStorage.length > 0) {
        for (const key of keys) {
            if ((name === JSON.parse(localStorage.getItem(key)).name) && (color === JSON.parse(localStorage.getItem(key)).color)) {
                return key;
            }
        }
        return false;
    }
    return false;
}