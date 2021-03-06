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
            const newQty = Number(storedCartProduct.qty) + Number(qty);
            LocalstorageService.updateCartProductQty(key, newQty);
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
}