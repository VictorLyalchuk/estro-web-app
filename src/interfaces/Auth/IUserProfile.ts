export interface IUserProfile
 {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    emailConfirmed: boolean,
    role: string,
    imagePath: string,
    phoneNumber: string,
    phoneNumberConfirmed: boolean,
    password: string,
    birthday: Date,
    bonusBalance: number,
}