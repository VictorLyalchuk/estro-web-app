interface FormData {
    confirmPassword: string;
    newPassword: string;
}

interface Errors {
    confirmPassword: string;
    newPassword: string;
}

export const validateForm = (formData: FormData): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        confirmPassword: "",
        newPassword: "",
    };

    if (formData.confirmPassword !== formData.newPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
    }

    if (formData.newPassword.trim() === '') {
        newErrors.newPassword = 'Password is required';
        isValid = false;
    } else if (formData.newPassword.length < 7) {
        newErrors.newPassword = 'Password must be at least 7 characters long';
        isValid = false;
    } else if (!/[a-z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one lowercase letter';
        isValid = false;
    } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one uppercase letter';
        isValid = false;
    } else if (!/\d/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one digit';
        isValid = false;
    } else if (!/[^a-zA-Z0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one symbol';
        isValid = false;
    }

    return { isValid, newErrors };
};