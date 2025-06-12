import { IProductFilters } from "../Info/IInfo";

export interface IAddProductData {
    name_en: string;
    name_uk: string;
    name_es: string;
    name_fr: string;
    article: string;
    price: string;
    season: string;
    color: string;
    material: string;
    sizes: IProductFilters[]; 
    mainCategory: string;
    subCategory: string;
    category: string;
    description_en: string;
    description_uk: string;
    description_es: string;
    description_fr: string;
    highlights_en: string[];
    highlights_uk: string[];
    highlights_es: string[];
    highlights_fr: string[];
}