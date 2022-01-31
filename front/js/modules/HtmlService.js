export default class HtmlService {
    constructor (document) {
        this.document = document;
    }

    getParamFromUrl(param) {
        return new URLSearchParams(this.document.location.search.substring(1)).get(param);
    }
    getNodeArray(querySelector) {
        return Array.from(this.document.querySelectorAll(querySelector));
    }
    insertHtmlElement(node, querySelector) {
        this.document.querySelector(querySelector).appendChild(node);
    }
    insertTextContent(content, querySelector) {
        this.document.querySelector(querySelector).textContent = content;
    }
    createFragment(elementsList) {
        const fragment = new DocumentFragment();
        elementsList.forEach( element => {
            fragment.appendChild(element);
        })
        return fragment;
    }
    createEventListenersFromElementsList(eventType, event, querySelector) {
        const elementsList = Array.from(this.document.querySelectorAll(querySelector));
        elementsList.forEach( element => {
            element.addEventListener(eventType, event);
        })
    }
}