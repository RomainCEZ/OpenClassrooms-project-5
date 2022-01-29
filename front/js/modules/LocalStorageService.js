import CartProduct from "./CartProduct.js";

export default class LocalstorageService {
    static getCartProduct(key) {
        const product = localStorage.getItem(key);
        return product ? JSON.parse(product) : null;
    }

    static saveCartProduct(key, cartProduct) {
        localStorage.setItem(key, JSON.stringify(cartProduct));
    }

    static removeCartProduct(key) {
        localStorage.removeItem(key);
    }
    
    static addProductToCart({ qty, color, id }) {
        const key = LocalstorageService.getKey(id, color);
        const storedCartProduct = LocalstorageService.getCartProduct(key);
        if (storedCartProduct) {
            LocalstorageService.addCartProductQty(key, storedCartProduct, qty);
        } else {
            const cartProduct = CartProduct.createCartProduct({ qty, color, id })
            LocalstorageService.saveCartProduct(key, cartProduct);
        }
    }

    static getKey(id, color) {
        return `${id}-${color}`;
    }

    static getCartProductsArray() {
        const cartProductsList = Object.values(localStorage);
        return cartProductsList.map( cartProduct => JSON.parse(cartProduct));
    }

    static updateCartProductQty(key, newQty) {
        const cartProduct = LocalstorageService.getCartProduct(key);
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: cartProduct.color,
            id: cartProduct.id
        })
        LocalstorageService.saveCartProduct(key, updatedCartProduct);
    }

    static addCartProductQty(key, storedCartProduct, qtyToAdd) {
        const storedQty = storedCartProduct.qty;
        const newQty = Number(storedQty) + Number(qtyToAdd);
        const updatedCartProduct = CartProduct.createCartProduct({
            qty: newQty,
            color: storedCartProduct.color,
            id: storedCartProduct.id
        })
        LocalstorageService.saveCartProduct(key, updatedCartProduct);
    }
}