export default class Router {
    goToUrl(URL) {
        window.location= URL;
    }

    getParamFromUrl(param) {
        return new URLSearchParams(document.location.search.substring(1)).get(param);
    }
}