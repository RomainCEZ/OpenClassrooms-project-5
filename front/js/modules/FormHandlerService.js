export default class FormHandlerService {

    static testRegEx(inputToTestId) {
        const stringToTest = document.getElementById(inputToTestId).value
        switch (inputToTestId) {
            case "firstName": 
            case "lastName":
                return /^[-'\s\p{L}\p{M}]+$/muig.test(stringToTest);
            case "address":
            case "city":
                return /^[0-9-'\s\p{L}\p{M}]+$/muig.test(stringToTest);
            case ("email"):
                return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(stringToTest);
        }
    }

    static editFormErrorMsg(inputIsValid, testedInputId) {
        const formInputHtml = document.getElementById(`${testedInputId}ErrorMsg`);
        if (!inputIsValid) {
            formInputHtml.textContent = "*Champ invalide.*"
        } else {
            formInputHtml.textContent = ""
        }
    }

    static testInputValidity(inputToTestId) {
        const inputIsValid = FormHandlerService.testRegEx(inputToTestId);
        FormHandlerService.editFormErrorMsg(inputIsValid, inputToTestId);
        return inputIsValid;
    }

    static testFormValidity(formInputList) {
        const validInputList = [];
        formInputList.forEach( input => {
            const inputIsValid = FormHandlerService.testInputValidity(input.id);
            if (inputIsValid) {
                validInputList.push(this);
            }
        })
        if (validInputList.length === formInputList.length) {
            return true
        }
    }
}
