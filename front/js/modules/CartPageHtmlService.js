import LocalstorageService from "./LocalStorageService.js";

export default class CartHtmlPageService {
    constructor (document) {
        this.document = document;
    }

    setCartProducts(productsList) {
        const cartFragment = new DocumentFragment();
        productsList.forEach( product => {
            const productHtml = product.createCartPageHtmlProduct;
            cartFragment.appendChild(productHtml);
        });
        document.getElementById("cart__items").appendChild(cartFragment);
    }

    insertParamValueIntoHtml(paramId, value) {
        this.document.getElementById(paramId).textContent = value;
    }

    forceInputMinMaxValue(inputQuerySelector) {
        if (inputQuerySelector.value < 1) {
            inputQuerySelector.value = 1;
        }
        if (inputQuerySelector.value > 100) {
            inputQuerySelector.value = 100;
        }
    }

    sumReducer(array) {
        const sum = (qty1, qty2) => (Number(qty1) + Number(qty2));
        return array.reduce(sum, 0);
    }

    calculateTotalQty() {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const qtyList = cartProductsList.map( product => product.qty)
        return this.sumReducer(qtyList);
    }
    
    calculateTotalPrice(productsList) {
        const cartProductsList = LocalstorageService.getCartProductsArray();
        const priceList = []
        cartProductsList.forEach( cartProduct => {
            const price = productsList.find( product => product.id === cartProduct.id).price;
            priceList.push(cartProduct.qty * price);
        });
        return this.sumReducer(priceList);
    }

    updateTotalQtyAndPrice(productsList) {
        const totalQuantity = this.calculateTotalQty(productsList);
        this.insertParamValueIntoHtml("totalQuantity", totalQuantity);
        const totalPrice = this.calculateTotalPrice(productsList);
        this.insertParamValueIntoHtml("totalPrice", totalPrice);
    }
}
