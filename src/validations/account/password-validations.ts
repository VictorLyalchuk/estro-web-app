interface Errors {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthday: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const validateFormPassword = (errorMessage: string, authType: string | undefined): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthday: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    if (authType === 'standard') {
        if (errorMessage !== '') {
            newErrors.password = 'Password is not correct';
            isValid = false;
        }
    }
    return { isValid, newErrors };
};