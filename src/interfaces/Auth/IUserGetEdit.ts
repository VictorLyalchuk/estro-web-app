export interface IUserGetEdit {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    birthday: Date,
    role: string,
    authType: string;
    password: string,
    imagePath: string | null,
    isBlocked: boolean;
}