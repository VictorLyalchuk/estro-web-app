export interface IBagUser{
    id: number;
    countProduct: number;
    orderDate: string;
    userEmail: string;
    userId: string;
}

export interface BagItems{
    id: number;
    productId: number;
    size: number;
    bagId: number;
    quantity: number;
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;
    article: string;
    price: number;
    image: string;
}