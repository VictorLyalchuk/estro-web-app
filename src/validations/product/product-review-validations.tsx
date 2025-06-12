interface Errors {
    rating: string;
    content: string;
}

export const validateForm = (rating: number, content: string): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        rating: '',
        content: '',
    };

    if (content.trim() === '') {
        newErrors.content = 'Content is required';
        isValid = false;
    }

    if (rating === 0 || rating === null) {
        newErrors.content = 'Rating is required';
        isValid = false;
    }
   
    return { isValid, newErrors };
};