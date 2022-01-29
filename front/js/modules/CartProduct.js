export default class CartProduct {
    constructor ({ qty, color, id}) {
        this.qty = qty,
        this.color = color,
        this.id = id
    }
    static createCartProduct({ qty, color, id}) {
        CartProduct.checkParameters(qty, color);
        return new CartProduct({ qty, color, id});
    }
    static checkParameters(qty, color) {
        if ( color === "") {
            throw new Error("*Veuillez choisir une couleur.*");
        }
        if ( qty < 1 || qty > 100 ) {
            throw new Error("*Veuillez saisir une quantité entre 1 et 100.*");
        }
    }
}