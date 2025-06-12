export interface IRegister {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    role: string,
    password: string,
    confirmPassword: string,
    imageFile: File | null,
    authType: string;
}