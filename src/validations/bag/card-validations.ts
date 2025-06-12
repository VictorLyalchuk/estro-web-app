interface CardData{
    creditCardNumber: string;
    creditCardHolderName: string;
    creditCardExpMonth: string;
    creditCardExpYear: string;
    creditCardCvv: string;
}

interface Errors {
    creditCardNumber: string,
    creditCardHolderName: string,
    creditCardExpMonth: string,
    creditCardExpYear: string,
    creditCardCvv: string,
}

export const validateForm = (cardData: CardData): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        creditCardNumber: '',
        creditCardHolderName: '',
        creditCardExpMonth: '',
        creditCardExpYear: '',
        creditCardCvv: '',
    };

    if (cardData.creditCardNumber.trim().length !== 16) {
        newErrors.creditCardNumber = 'Credit card number must be 16 digits.';
        isValid = false;
    }

    if (cardData.creditCardHolderName.trim() === '') {
        newErrors.creditCardHolderName = 'Card holder name is required.';
        isValid = false;
    }

    if (cardData.creditCardExpMonth === '') {
        newErrors.creditCardExpMonth = 'Expiration month is required.';
        isValid = false;
    }

    if (cardData.creditCardExpYear === '') {
        newErrors.creditCardExpYear = 'Expiration year is required.';
        isValid = false;
    }

    if (cardData.creditCardCvv.length !== 3) {
        newErrors.creditCardCvv = 'CCV must be 3 digits.';
        isValid = false;
    }

    return { isValid, newErrors };
};