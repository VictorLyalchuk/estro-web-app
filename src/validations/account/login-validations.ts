interface FormData {
    email: string;
    password: string;
    phoneNumber: string;
    authType: string;
}

interface Errors {
    email: string;
    password: string;
    phoneNumber: string;
    authType: string;
}

export const validateForm = (formData: FormData, textmask: string): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        email: "",
        password: "",
        phoneNumber: "",
        authType: "",
    };

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
    }

    if (formData.authType === "phone") {

        const cleanedPhoneNumber = textmask.replace(/\D/g, '');
        if (cleanedPhoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
        }
        else if (!/^(067|095|099|066|063|098|097|096|093)\d{7}$/.test(cleanedPhoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
            isValid = false;
        }
    }
    if (formData.password.trim() === '') {
        newErrors.password = 'Password is required';
        isValid = false;
    }

    return { isValid, newErrors };
};