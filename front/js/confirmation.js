// eslint-disable-next-line no-unused-vars
class ConfirmationPage {
    constructor( router ) {
        this.router = router
    }

    renderHtml() {
        const orderId = this.router.getParamFromUrl("orderId");
        this.displayOrderId(orderId);
    }

    displayOrderId(orderId) {
        document.getElementById("orderId").textContent = orderId;
    }
}