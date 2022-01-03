const rewire = require("rewire");
const productModule = rewire("./product.js");
const CartProduct = productModule.__get__('CartProduct');
describe('product', () => { 
    it('should return an error when quantity is lower than 1', () => { 
        expect(() => CartProduct.createCartProduct({ color: 'myColor', product: null, qty: -1 }))
            .toThrow("*Veuillez saisir une quantité entre 1 et 100.*"); 
    })
    it('should return an error when quantity is higher than 100', () => { 
        expect(() => CartProduct.createCartProduct({ color: 'myColor', product: null, qty: 101 }))
            .toThrow("*Veuillez saisir une quantité entre 1 et 100.*"); 
    })
})