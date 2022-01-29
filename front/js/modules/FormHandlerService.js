export default class FormHandlerService {
    static testEmailRegEx(string) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(string);
    }
    
    static testAddressRegEx(string) {
        return /^[0-9-'\s\p{L}\p{M}]+$/muig.test(string);
    }
    
    static testNameRegEx(string) {
        return /^[-'\s\p{L}\p{M}]+$/muig.test(string);
    }

    static editFormErrorMsg(validInput, formInputHtmlId) {
        const formInputHtml = document.getElementById(`${formInputHtmlId.id}ErrorMsg`);
        if (!validInput) {
            formInputHtml.textContent = "*Champ invalide.*"
        } else {
            formInputHtml.textContent = ""
        }
    }

    static testNameValidity(formInputHtmlId) {
        const validName = FormHandlerService.testNameRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validName, formInputHtmlId);
        return validName;
    }
    
    static testAdressValidity(formInputHtmlId) {
        const validAddress = FormHandlerService.testAddressRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validAddress, formInputHtmlId);
        return validAddress;
    }
    
    static testEmailValidity(formInputHtmlId) {
        const validEmail = FormHandlerService.testEmailRegEx(formInputHtmlId.value);
        FormHandlerService.editFormErrorMsg(validEmail, formInputHtmlId);
        return validEmail;
    }

    static testFormValidity() {
        const firstNameInputHtml = document.getElementById("firstName");
        const validFirstName = FormHandlerService.testNameValidity(firstNameInputHtml);
        const lastNameInputHtml = document.getElementById("lastName");
        const validLastName = FormHandlerService.testNameValidity(lastNameInputHtml);
        const addressInputHtml = document.getElementById("address");
        const validAddress = FormHandlerService.testAdressValidity(addressInputHtml);
        const cityInputHtml = document.getElementById("city");
        const validCity = FormHandlerService.testAdressValidity(cityInputHtml);
        const emailInputHtml = document.getElementById("email");
        const validEmail = FormHandlerService.testEmailValidity(emailInputHtml);
        if (validFirstName && validLastName && validAddress && validCity && validEmail) {
            return true;
        }
    }
}
