import Router from "./modules/Router.js";

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

const confirmationPage = new ConfirmationPage( new Router());
confirmationPage.renderHtml();