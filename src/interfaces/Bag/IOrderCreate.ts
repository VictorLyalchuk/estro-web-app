export interface IOrderCreate{
    email: string;
    emailUser: string;
    firstName: string;
    lastName: string;
    phonenumber: string;

    payment: string;
    paymentMethod: string,
    cardHolderName : string,
    cardNumber : string,
    cardMonthExpires : string,
    cardYearExpires : string,
    
    country: string;
    city: string;
    state: string;
    street: string;
    discount: number;
}