interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    payment: string;
}

interface ShippingData {
    country: string,
    city: string,
    state: string,
    street: string,
}

interface Errors {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    country: string,
    city: string,
    state: string,
    street: string,
    paymentMethod: string;
    shipping: string;
}

export const validateForm = (formData: FormData, shippingData: ShippingData, selectedPayment: string, selectedShipping: string, textmask: string, setActiveBlocks: (blocks: (prevBlocks: string[]) => string[]) => void
): { isValid: boolean; newErrors: Errors } => {
    let isValid = true;
    const newErrors: Errors = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        country: "",
        city: "",
        state: "",
        street: "",
        paymentMethod: "",
        shipping: "",
    };

    if (formData.firstName.trim() === '') {
        newErrors.firstName = 'First Name is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
    }

    if (formData.lastName.trim() === '') {
        newErrors.lastName = 'Last Name is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
    }

    if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
    }

    if (selectedPayment === '') {
        newErrors.paymentMethod = 'Payment is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('payment') ? prevBlocks : [...prevBlocks, 'payment']);
    }

    if (shippingData.country.trim() === '') {
        newErrors.country = 'Country is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
    }

    if (shippingData.city.trim() === '') {
        newErrors.city = 'City is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
    }

    if (selectedShipping === '') {
        newErrors.shipping = 'Shipping is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
    }

    else if (selectedShipping === 'Store') {
        if (shippingData.street.trim() === '') {
            newErrors.street = 'Store is required';
            isValid = false;
            setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
        }
    }
    else if (selectedShipping === 'Address') {
        if (shippingData.street.trim() === '') {
            newErrors.street = 'Street is required';
            isValid = false;
            setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
        }
    }

    if (selectedShipping === 'Address') {
        if (shippingData.state.trim() === '') {
            newErrors.state = 'State is required';
            isValid = false;
            setActiveBlocks(prevBlocks => prevBlocks.includes('delivery') ? prevBlocks : [...prevBlocks, 'delivery']);
        }
    }
    if (textmask) {
        const cleanedPhoneNumber = textmask.replace(/\D/g, '');
        if (cleanedPhoneNumber.trim() === '') {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
            setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
        }
        else if (!/^(067|095|099|066|063|098|097|096|093)\d{7}$/.test(cleanedPhoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number format';
            isValid = false;
            setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
        }
    } else {
        newErrors.phoneNumber = 'Phone Number is required';
        isValid = false;
        setActiveBlocks(prevBlocks => prevBlocks.includes('personal') ? prevBlocks : [...prevBlocks, 'personal']);
    }

    return { isValid, newErrors };
};