interface FormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  password: string;
  newPassword: string,
  confirmNewPassword: string,
}

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

export const validateForm = (formData: FormData, textmask: string, authType: string | undefined): { isValid: boolean; newErrors: Errors } => {
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

  if (formData.firstName.trim() === '') {
    newErrors.firstName = 'First Name is required';
    isValid = false;
  }

  if (formData.lastName.trim() === '') {
    newErrors.lastName = 'Last Name is required';
    isValid = false;
  }

  if (formData.email.trim() === '' || !/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email address';
    isValid = false;
  }

  if (authType === 'standard') {

    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    // if (errorMessage !== '') {
    //   newErrors.password = 'Password is not correct';
    //   isValid = false;
    // }
  }

  if (textmask) {
    const cleanedPhoneNumber = textmask.replace(/\D/g, '');
    if (cleanedPhoneNumber.trim() === '') {
      newErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    } else if (!/^(067|095|099|066|063|098|097|096|093)\d{7}$/.test(cleanedPhoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
      isValid = false;
    }
  } else {
    newErrors.phoneNumber = 'Phone Number is required';
    isValid = false;
  }

  if (formData.newPassword !== formData.confirmNewPassword) {
    newErrors.confirmNewPassword = 'Passwords do not match';
    isValid = false;
  }
  if (formData.newPassword !== '') {
    if (formData.newPassword.length < 7) {
      newErrors.newPassword = 'Password must be at least 7 characters long';
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one digit';
      isValid = false;
    } else if (!/[^a-zA-Z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one symbol';
      isValid = false;
    }
  }
  return { isValid, newErrors };
};