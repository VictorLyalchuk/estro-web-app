import { IStorages } from "../Product/IProduct";

export interface IFavoriteProducts {
    // id: number;
    userId: string;
    productId: number;
    productName_en: string;
    productName_uk: string;
    productName_es: string;
    productName_fr: string;
    productPrice: number;
    productImage: string;
    storages: IStorages[] | null;
}