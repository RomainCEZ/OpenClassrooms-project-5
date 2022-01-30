import HtmlService from "./modules/HtmlService.js";

class ConfirmationPage {
    constructor(htmlService) {
        this.htmlService = htmlService;
    }
    renderConfirmationPage() {
        const orderId = this.htmlService.getParamFromUrl("orderId");
        this.htmlService.insertTextContent(orderId, "#orderId");
    }
}

const confirmationPage = new ConfirmationPage(new HtmlService(document));
confirmationPage.renderConfirmationPage();