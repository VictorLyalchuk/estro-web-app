interface FormData {
    email: string;
}

interface Errors {
    email: string;
}

export const validateForm = (formData: FormData): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        email: "",
    };

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
    }

    return { isValid, newErrors };
};